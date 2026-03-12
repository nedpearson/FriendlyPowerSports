$env:FLASK_APP="app/app.py"
$env:FLASK_DEBUG="1"
$env:FLASK_PORT="5007"
flask run -p $env:FLASK_PORT
