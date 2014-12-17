from lxml import html
import requests

# Define parsing function
def parse(score):
	return float(score[2:score.index('-')])

def scrape(league_id):
	# Store scores in list
	league_scores = []
	
	# Loop through each team
	for team_id in range(1, 12):
		# Make request
		page = requests.get('http://games.espn.go.com/ffl/schedule?leagueId=' + league_id + '&teamId=' + str(team_id))
		tree = html.fromstring(page.text)

		# Get team name
		team_name = tree.xpath('//h1/text()')
		team_name = [name for name in team_name if name != '\n'][0].replace(' Schedule', '')

		# Get weekly scores
		if team_name != 'Mass Text Appeal III':
			weekly_scores = tree.xpath('//nobr//a[@href]/text()')
			weekly_scores = [score for score in weekly_scores if score != 'Box' and (score[0] == 'W' or score[0] =='L')]
			weekly_scores = list(map(parse, weekly_scores))

			# Store in league_scores list
			league_scores.append({
				'name': team_name,
				'scores': weekly_scores
				})
			
	return league_scores