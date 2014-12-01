import urllib

from google.appengine.api import users
from google.appengine.ext import ndb

import webapp2
from jinja_config import JINJA_ENVIRONMENT


class Breakdown(ndb.Model):
    """Models an individual moneybook entity."""
    author = ndb.UserProperty()
    content = ndb.StringProperty(indexed=False)
    date = ndb.DateTimeProperty(auto_now_add=True)

class Moneybook(webapp2.RequestHandler):
    def get(self):

        # Ancestor Queries, as shown here, are strongly consistent with the High
        # Replication Datastore. Queries that span entity groups are eventually
        # consistent. If we omitted the ancestor from this query there would be
        # a slight chance that Breakdown that had just been written would not
        # show up in a query.
        breakdown_query = Breakdown.query(ancestor=ndb.Key('moneybook', 'moneybook')).order(-Breakdown.date)

        list = breakdown_query.fetch(10)

        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'

        values = {
        	'list': list,
            'url': url,
            'url_linktext': url_linktext,
        }

        template = JINJA_ENVIRONMENT.get_template('moneybook.html')
        self.response.write(template.render(values))


class GuestBook(webapp2.RequestHandler):
    def post(self):
        # We set the same parent key on the 'Breakdown' to ensure each Breakdown
        # is in the same entity group. Queries across the single entity group
        # will be consistent. However, the write rate to a single entity group
        # should be limited to ~1/second.
        guestbook_name = self.request.get('guestbook_name', DEFAULT_GUESTBOOK_NAME)
        greeting = Breakdown(parent=guestbook_key(guestbook_name))

        if users.get_current_user():
            greeting.author = users.get_current_user()

        greeting.content = self.request.get('content')
        greeting.put()

        query_params = {'guestbook_name': guestbook_name}
        self.redirect('/?' + urllib.urlencode(query_params))

