console.log('event', event)
const { metadata } = event.payload
const { userId } = metadata
if (userId) {
  event.state.user.userId = userId
}
