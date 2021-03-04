import http.client

conn = http.client.HTTPSConnection("api.sportradar.us")

conn.request("GET", "/nba/trial/v7/en/players/37fbc3a5-0d10-4e22-803b-baa2ea0cdb12/profile.xml?api_key=uqmd4rxymg52xwva8h6vc36j")

res = conn.getresponse()
data = res.read()

print(type(data.decode("utf-8")))