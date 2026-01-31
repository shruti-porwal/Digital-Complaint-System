export const chatbotController = {
  message(req, res) {
    const { message } = req.body || {}
    const reply =
      'I can help you with complaint submission, tracking, and FAQs. What would you like to know?'
    res.json({ reply })
  },
}
