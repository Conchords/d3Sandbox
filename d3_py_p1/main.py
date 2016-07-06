from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route('/')
@app.route('/index')
def index():
	return render_template('index.html')
	
@app.route('/d3vis')
def d3vis():
	return render_template('d3vis.html')

if __name__== "__main__":
	app.run(debug=True)