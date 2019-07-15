# ChitChat

ChitChat is a minimal chat application that allows creation of chat rooms and talking with other people in that room. The primary focus on this build was designing with horizontal scalability in mind.

### Run Locally

The full application can be run through Docker Compose with the following command:

```
docker-compose build
docker-compose up
```
The chat client can then be accessed at [localhost:8080](localhost:8080).

### Application Design

When I first started thinking through how to design this system a couple of primary assumptions were in mind, that chat should be near real-time for senders and receivers (regardless of number of clients connected) and that message distribution would likely scale very differently than message receipt. With those two factors in mind, here's how the different elements of this application play in to that:

- **chat-svc**: the `chat-svc`, as is, is responsible for accepting messages sent by a user in a given room and publishing that to a Redis channel. The future state of this service would/could also include room creation, registered room lists, message editing, etc..
- **session-svc**: the `session-svc` handles all client WebSocket connections, subscribes to the necessary Redis channel and distributes messages to clients appropriately.
- **web-client**: a (very bad) sample frontend client using the `chat-svc` and `session-svc`.

### Work Unfinished / Future Work

- **Testing**: As of now there is no testing in place for this application, this is due solely to a lack of time but would be first in the queue to get caught up.
- **Message Persistence**: There's currently no message persistence in place, if a chat window is refreshed, that user loses not just the history they've seen but also any messages that happen b/w when they disconnect and reconnect. On creation (before publishing to Redis) messages should be persisted (Postgres, etc.).
- **Immutable Web Apps**: The front-end was isolated as it was because time permitting the plan was to get this in a deployable state using the following methodology: https://immutablewebapps.org/.