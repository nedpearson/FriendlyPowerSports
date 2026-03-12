from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    # Running on a different port to avoid conflict with Roberts Enterprise
    app.run(debug=True, port=5007)
