import webapp2
import guestbook
import moneybook

app = webapp2.WSGIApplication([
    ('/', moneybook.Moneybook),
    ('/sign', guestbook.GuestBook),
], debug=True)