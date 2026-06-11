import os
import cv2
import numpy as np
import pickle
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

# =========================
# 🔥 LOAD YOLO MODEL
# =========================
vehicle_model = YOLO("yolov8n.pt")

# =========================
# 🧠 RL AGENT
# =========================
class TrafficRLAgent:
    def __init__(self):
        self.q_table = {}
        self.actions = ["lane1", "lane2", "lane3", "lane4"]
        self.alpha = 0.1
        self.gamma = 0.9
        self.epsilon = 0.02  # Less randomness

    def get_state(self, lane_data):
        return tuple([
            lane_data["lane1"]["count"],
            lane_data["lane2"]["count"],
            lane_data["lane3"]["count"],
            lane_data["lane4"]["count"]
        ])

    def choose_action(self, state):
        if np.random.rand() < self.epsilon:
            return np.random.choice(self.actions)

        if state not in self.q_table:
            self.q_table[state] = np.zeros(len(self.actions))

        return self.actions[np.argmax(self.q_table[state])]

    def update(self, state, action, reward, next_state):
        if state not in self.q_table:
            self.q_table[state] = np.zeros(len(self.actions))

        if next_state not in self.q_table:
            self.q_table[next_state] = np.zeros(len(self.actions))

        action_idx = self.actions.index(action)

        self.q_table[state][action_idx] += self.alpha * (
            reward + self.gamma * np.max(self.q_table[next_state])
            - self.q_table[state][action_idx]
        )

    def save(self):
        with open("ai-model/model.pkl", "wb") as f:
            pickle.dump(self.q_table, f)

    def load(self):
        try:
            with open("ai-model/model.pkl", "rb") as f:
                self.q_table = pickle.load(f)
        except:
            print("No RL model found, starting fresh")


class TrafficEnvironment:
    def calculate_reward(self, lane_data, selected_lane):
        total_wait = sum([lane_data[l]["count"] for l in lane_data])
        reward = -total_wait

        max_lane = max(lane_data, key=lambda x: lane_data[x]["count"])
        if selected_lane == max_lane:
            reward += 10

        return reward


agent = TrafficRLAgent()
env = TrafficEnvironment()
agent.load()

# =========================
# 📁 STORAGE
# =========================
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs("ai-model", exist_ok=True)

# =========================
# 🚦 GLOBAL STATE
# =========================
lane_data = {
    "lane1": {"count": 0, "ambulance": False, "time": 0},
    "lane2": {"count": 0, "ambulance": False, "time": 0},
    "lane3": {"count": 0, "ambulance": False, "time": 0},
    "lane4": {"count": 0, "ambulance": False, "time": 0},
}

current_green_lane = "lane1"

# =========================
# 📤 UPLOAD API
# =========================
@app.route("/upload", methods=["POST"])
def upload():
    try:
        for i in range(1, 5):
            file = request.files.get(f"lane{i}")
            if not file:
                return jsonify({"error": f"lane{i} missing"}), 400

            filepath = os.path.join(UPLOAD_FOLDER, f"lane{i}.mp4")
            file.save(filepath)

        return jsonify({"message": "Upload successful"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# 📊 STATS API
# =========================
@app.route("/stats")
def stats():
    return jsonify(lane_data)

# =========================
# 📊 ANALYSIS API
# =========================
@app.route("/analysis")
def analysis():
    data = {}

    for lane, info in lane_data.items():
        count = info["count"]
        data[lane] = {
            "cars": int(count * 0.5),
            "buses": int(count * 0.2),
            "trucks": int(count * 0.2),
            "bikes": int(count * 0.1),
            "total": count
        }

    comparison = {
        "traditional": [30, 30, 30, 30],
        "smart": [
            lane_data["lane1"]["time"],
            lane_data["lane2"]["time"],
            lane_data["lane3"]["time"],
            lane_data["lane4"]["time"],
        ]
    }

    return jsonify({
        "lanes": data,
        "comparison": comparison
    })

# =========================
# 🎥 VIDEO PROCESSING
# =========================
def generate_frames(video_path, lane):
    cap = cv2.VideoCapture(video_path)

    while True:
        success, frame = cap.read()
        if not success:
            break

        results = vehicle_model(frame)

        vehicle_count = 0
        ambulance_detected = False

        for r in results:
            for box in r.boxes:
                cls = int(box.cls[0])
                label = vehicle_model.names[cls]

                if label in ["car", "bus", "truck", "motorcycle"]:
                    vehicle_count += 1

                x1, y1, x2, y2 = map(int, box.xyxy[0])
                roi = frame[y1:y2, x1:x2]

                # 🚑 Improved ambulance detection
                if label in ["car", "bus", "truck"]:
                    width = x2 - x1
                    height = y2 - y1
                    if roi.mean() > 180 and width > 80 and height > 80:
                        ambulance_detected = True
                        cv2.putText(frame, "AMBULANCE", (x1, y1 - 20),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

                cv2.rectangle(frame, (x1, y1), (x2, y2), (0,165,255), 2)
                cv2.putText(frame, label, (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,165,255), 2)

        # ⏱ Signal time calculation
        green_time = max(5, vehicle_count * 2)

        lane_data[lane]["count"] = vehicle_count
        lane_data[lane]["ambulance"] = ambulance_detected
        lane_data[lane]["time"] = green_time

        text = f"Density: {vehicle_count} | Ambulance: {'Yes' if ambulance_detected else 'No'} | Time: {green_time}s"

        cv2.rectangle(frame, (0, frame.shape[0]-40),
                      (frame.shape[1], frame.shape[0]), (0,0,0), -1)

        cv2.putText(frame, text,
                    (10, frame.shape[0]-10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (255,255,255),
                    2)

        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# =========================
# 🎥 VIDEO STREAM
# =========================
@app.route("/video/<lane>")
def video_feed(lane):
    path = f"uploads/{lane}.mp4"

    if not os.path.exists(path):
        return "Video not found", 404

    return Response(generate_frames(path, lane),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# =========================
# 🚦 TRAFFIC CONTROL (RL)
# =========================
@app.route("/traffic")
def traffic():
    global current_green_lane

    # 🚑 Emergency override
    for lane, data in lane_data.items():
        if data["ambulance"]:
            current_green_lane = lane
            return jsonify({
                "green": lane,
                "reason": "ambulance",
                "time": data["time"]
            })

    # 🧠 RL decision
    state = agent.get_state(lane_data)
    action = agent.choose_action(state)

    # 🚨 Safety override
    max_lane = max(lane_data, key=lambda x: lane_data[x]["count"])
    if lane_data[max_lane]["count"] > 5:
        action = max_lane

    reward = env.calculate_reward(lane_data, action)
    next_state = agent.get_state(lane_data)

    agent.update(state, action, reward, next_state)
    agent.save()

    current_green_lane = action

    return jsonify({
        "green": action,
        "reason": "RL",
        "reward": reward
    })

# =========================
# 🏠 HOME
# =========================
@app.route("/")
def home():
    return "Traffic AI + RL Running 🚀"

# =========================
# ▶ RUN
# =========================
if __name__ == "__main__":
    app.run(debug=True)