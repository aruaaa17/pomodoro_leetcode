import requests
from flask import Flask, jsonify, request

from datetime import datetime

from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# ALFA_API_BASE = "https://alfaarghya-leetcode-api.vercel.app/api"
ALFA_API_BASE = "http://localhost:3000"

def get_user_submissions(username):
    url = f"{ALFA_API_BASE}/{username}/submission"
    response = requests.get(url)
    if response.status_code != 200:
        return None
    data = response.json()
    return data
def filter_today_submissions(submissions):
    today_str = datetime.now().strftime("%Y-%m-%d")
    today_subs = []
    for sub in submissions:
        ts = sub.get("timestamp")
        if not ts:
            continue
        # 时间戳是秒数的字符串，转换为日期字符串
        dt = datetime.fromtimestamp(int(ts))
        if dt.strftime("%Y-%m-%d") == today_str:
            today_subs.append(sub)
    return today_subs

@app.route("/")
def index():
    return """
    <h1>LeetCode 提交查询</h1>
    <form action="/leetcode-submissions" method="get" target="_blank">
        <label for="username">请输入 LeetCode 用户名:</label>
        <input type="text" id="username" name="username" required>
        <button type="submit">获取今日提交</button>
    </form>
    """

@app.route("/leetcode-submissions")
def leetcode_submissions():
    username = request.args.get("username")
    if not username:
        return jsonify({"error": "username query param required"}), 400

    data = get_user_submissions(username)
    if not data:
        return jsonify({"error": "failed to fetch submissions"}), 500

    submissions = data.get("submission", [])
    today_subs = filter_today_submissions(submissions)

    return jsonify({
        "username": username,
        "today_submissions": today_subs
    })

if __name__ == "__main__":
    app.run(debug=True)
