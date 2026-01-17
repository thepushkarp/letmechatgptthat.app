export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: "What is Let Me ChatGPT That?",
    answer:
      "Let Me ChatGPT That is a free tool that creates shareable links to demonstrate how easy it is to ask ChatGPT a question. It's inspired by the classic 'Let Me Google That For You' concept, updated for the AI age.",
  },
  {
    question: "How do I create a link?",
    answer:
      "Simply type your question in the input box on the homepage and click 'Generate Link'. You'll get a short URL that you can copy and share with anyone.",
  },
  {
    question: "What happens when someone clicks my link?",
    answer:
      "They'll see a realistic animation of someone typing the question into ChatGPT, followed by a countdown. After the countdown, they're redirected to the actual ChatGPT website with your question pre-filled.",
  },
  {
    question: "Is this affiliated with OpenAI or ChatGPT?",
    answer:
      "No, this is an independent project and is not affiliated with, endorsed by, or connected to OpenAI in any way. ChatGPT is a trademark of OpenAI.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes, Let Me ChatGPT That is completely free to use. There are no premium features, subscriptions, or hidden costs.",
  },
  {
    question: "How long do the generated links last?",
    answer:
      "Generated links remain active for 30 days from creation. After that, they expire and will no longer work.",
  },
  {
    question: "Is there a character limit for questions?",
    answer:
      "Yes, questions are limited to 2,000 characters. This is more than enough for most questions while ensuring links remain manageable.",
  },
  {
    question: "Can I customize the animation or redirect behavior?",
    answer:
      "Currently, the animation and redirect timing are fixed to provide a consistent experience. The recipient can skip the countdown by clicking the send button or pressing Enter.",
  },
  {
    question: "Does this work on mobile devices?",
    answer:
      "Yes! The site is fully responsive and works on both desktop and mobile devices. On touch devices, you'll see a tap animation instead of a cursor.",
  },
  {
    question: "Is my data private?",
    answer:
      "We only store the question text needed to generate your link. We don't track personal information, and links automatically expire after 30 days. The questions are stored securely and are only used to display the animation.",
  },
];
