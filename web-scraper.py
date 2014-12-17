from lxml import html
import requests

# Store scores in dictionary
leagueScores = {}

# Define parsing function
def parse(score):
	return float(score[2:score.index('-')])

# Loop through each team (TODO)
for teamID in range(1, 13):
	# Make request
	page = requests.get('http://games.espn.go.com/ffl/schedule?leagueId=14598&teamId=' + str(teamID))
	tree = html.fromstring(page.text)

	# Get team name
	teamName = tree.xpath('//h1/text()')
	teamName = [name for name in teamName if name != '\n'][0].replace(' Schedule', '')

	# Get weekly scores
	if teamName != 'Mass Text Appeal III':
		weeklyScores = tree.xpath('//nobr//a[@href]/text()')
		weeklyScores = [score for score in weeklyScores if score != 'Box' and score[0] == ('W' or 'L')]
		weeklyScores = list(map(parse, weeklyScores))

		# Store in leagueScores dictionary		
		leagueScores[teamName] = weeklyScores

print leagueScores	