'use client'

import Link from 'next/link'
import { Container } from '@chakra-ui/react'
import { Prose } from '@nikolovlazar/chakra-ui-prose'

export default function Cookies() {
  return (
    <Container>
      <Prose>
        <div className="pb-4">
          <div className="subsection">
            <h1>Balancer Cookies&nbsp;Policy</h1>
            <p>
              <em>Last Updated: October 2023</em>
            </p>
          </div>
          <div className="subsection">
            <h2>I. Introduction and Scope of Policy</h2>
            <p>
              This Cookies Policy (“Policy”) applies to your interaction with the Balancer
              Foundation, its subsidiary, Balancer OpCo Limited, and material service providers
              operating under a legal agreement (“Balancer Foundation,” “Balancer,” “we,” “our,” or
              “us”).
            </p>
          </div>

          <div className="subsection">
            <h2>II. About Cookies</h2>
            <p>
              Cookies are pieces of data stored on your device. Browser cookies are assigned by a
              web server to the browser on your device. When you return to a site you have visited
              before, your browser gives this data back to the server. Mobile applications may also
              use cookies.
            </p>

            <p>
              We do not generally use cookies; however our third party vendors do. We do not
              intentionally collect information to customize your experience on the website or the
              Balancer.fi user interface (UI) to the Balancer Protocol. (“Sites” or “Site”).
            </p>
            <p>
              Industry standards are currently evolving, and we may not separately respond to or
              take any action with respect to a “do not track” configuration set in your internet
              browser.
            </p>
            <p>
              Other parties that collect information about your web browsing behavior when you use
              our Site are generally limited to service providers who only use any information
              collected to provide services for us and not to provide services or advertising for
              any other party. Note, however, that we also provide certain widgets or tools on our
              sites that allow you to interact with third parties who provide these features, such
              as tools that allow web surfers to easily share information on another platform. At
              other times, information from a third party may be embedded on our Site, such as a
              map. These widgets, tools, and informational items often function through the use of
              third-party cookies utilized by the third party site. As a result, these third parties
              may have access to information about your web browsing on the pages of our Site where
              these widgets, tools, or information are placed. You may wish to review information at
              third party sites, where you have an account, to determine how these third parties
              treat data that they obtain through the use of cookies.
            </p>
          </div>

          <div className="subsection">
            <h2>III. Do You Have to Accept Cookies?</h2>

            <p>
              You may be able to set your browser to reject cookies. If you set your browser options
              to disallow cookies, you may limit the functionality we can provide when you visit our
              Site. The latest versions of internet browsers provide cookie management tools, such
              as the ability to delete or reject cookies. We recommend that you refer to information
              supplied by browser providers for more specific information, including how to use
              these tools.
            </p>
          </div>
          <div className="subsection">
            <h2>IV. Additional Technologies</h2>
            <p>
              We do not typically use additional technologies such as pixel tags, web beacons, and
              clear GIFs. We permit third-party service providers to use these technologies. They
              use these technologies for purposes such as determining viewing and response rates.
            </p>
          </div>
          <div className="subsection">
            <h2>V. Using Information</h2>
            <p>
              In addition to the uses described above, we may use information for purposes as
              allowed by law such as: servicing; communicating with you; improving our Site,
              products, or services; legal compliance; risk control; information security;
              anti-fraud purposes; tracking website usage, such as number of hits, pages visited,
              and the length of user sessions in order to evaluate the usefulness of our sites.
            </p>
          </div>
          <div>
            <h2>VI. Sharing</h2>
            <p>
              We share information with service providers with whom we work, such as service
              providers and companies that help us service you better. When permitted or required by
              law, we may share information with additional third parties for purposes including
              response to legal process. As applicable, please see our{' '}
              <Link href="privacy-policy">Privacy policy</Link> for more information on how we may
              share information with affiliates and third parties.
            </p>
          </div>
        </div>
      </Prose>
    </Container>
  )
}
