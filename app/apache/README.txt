#Add this to your /etc/apache2/sites-available/default file

    Alias /CompMusicBrowser/ /path/to/CompMusicBrowser/web/
    <Directory /path/to/CompMusicBrowser/web/>
        Order deny,allow
        Deny from all
        Allow from 10.80.0.0/255.0.0.0 127.0.0.0/255.0.0.0 ::1/128
    </Directory>


    WSGIScriptAlias / /path/to/CompMusicBrowser/app/api/API.py/

    AddType text/html .py

    <Directory /path/to/CompMusicBrowser/app/api/>
        Order deny,allow
        Allow from all
    </Directory>
