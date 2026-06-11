class TrafficEnvironment:

    def calculate_reward(self, lane_data, selected_lane):
        total_wait = sum([lane_data[l]["count"] for l in lane_data])

        # reward = less waiting = better
        reward = -total_wait

        # bonus if selected lane has max vehicles
        max_lane = max(lane_data, key=lambda x: lane_data[x]["count"])

        if selected_lane == max_lane:
            reward += 10

        return reward