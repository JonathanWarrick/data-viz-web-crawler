import json
from flask import Flask, render_template, request
from web_scraper import parse, scrape
app = Flask(__name__)

@app.route('/')
def hello_world():
	league_id = request.args.get('league_id')
	if league_id:
		return render_template('index.html', data=scrape(league_id))
		# return render_template('index.html', data=['test', 'test2', 'test3'])
	else:
		return render_template('formTemplate.html')


if __name__ == '__main__':
	app.run(debug=True)