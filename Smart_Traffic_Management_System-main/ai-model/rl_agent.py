import numpy as np
import pickle

class TrafficRLAgent:
    def __init__(self):
        self.q_table = {}
        self.actions = ["lane1", "lane2", "lane3", "lane4"]

        self.alpha = 0.1
        self.gamma = 0.9
        self.epsilon = 0.1

    def get_state(self, lane_data):
        # state = vehicle counts tuple
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

        self.q_table[state][action_idx] = (
            self.q_table[state][action_idx]
            + self.alpha * (
                reward
                + self.gamma * np.max(self.q_table[next_state])
                - self.q_table[state][action_idx]
            )
        )

    def save(self):
        with open("ai-model/model.pkl", "wb") as f:
            pickle.dump(self.q_table, f)

    def load(self):
        try:
            with open("ai-model/model.pkl", "rb") as f:
                self.q_table = pickle.load(f)
        except:
            print("No pretrained model found")