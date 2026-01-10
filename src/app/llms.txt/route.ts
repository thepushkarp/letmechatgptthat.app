export async function GET() {
  const content = `# Let Me ChatGPT That For You

> A playful tool for sharing ChatGPT queries with friends who could have looked something up themselves.

## About

Similar to "Let Me Google That For You" (LMGTFY) but for ChatGPT. Create shareable links that demonstrate how easy it is to ask ChatGPT a question.

## How to Use

1. Visit https://letmechatgptthat.app/
2. Type your question in the input field
3. Click "Generate Link" to create a shareable URL
4. Share the link with someone who asked an easily ChatGPT-able question
5. Watch as the animation types their question and redirects to ChatGPT

## Example

If someone asks "What's the capital of France?", you can:

1. Create a link at https://letmechatgptthat.app/
2. Share the link with short URL (they'll never know what's inside it)
3. They'll see an animated typing effect followed by redirection to ChatGPT
4. Realization that they could have just asked ChatGPT themselves

## Use Cases

- Playfully responding to questions that could easily be asked to ChatGPT
- Demonstrating how to use ChatGPT to friends or colleagues
- Giving that annoying friend a break

## Technical Details

- Free to use, no registration required
- Works in any modern web browser
- No data is stored

## Contact

- Creator: Pushkar Patel
- Website: https://thepushkarp.com
- Twitter: https://twitter.com/thepushkarp
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
