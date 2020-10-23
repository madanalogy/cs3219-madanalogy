import items from './index'

describe('items HTTPS Cloud Function', () => {
  it('should respond with hello message when sent an empty request', async () => {
    const req = {}
    // A fake response object, with a stubbed end function
    const res = {
      end: sinon.stub()
    }
    // Invoke https function with fake request + response objects
    await items(req, res)
    expect(res.end).to.have.been.calledWith('Hello from items!')
  })
})
