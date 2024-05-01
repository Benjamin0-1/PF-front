import React, { useState } from 'react';
import './FAQ.css'

const FAQ = () => {
  const [showAnswer, setShowAnswer] = useState({});

  const toggleAnswer = (index) => {
    setShowAnswer(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const faqs = [
    { 
      question: 'How do I place an order?', 
      answer: 'To place an order, simply browse our products, select the items you want to purchase, and proceed to checkout. You will need to provide your shipping address and payment information to complete the order.' 
    },
    { 
      question: 'What payment methods do you accept?', 
      answer: 'We accept a variety of payment methods including Visa, MasterCard, American Express, PayPal, and Apple Pay. You can choose your preferred payment method during checkout.' 
    },
    { 
      question: 'Can I modify or cancel my order after it has been placed?', 
      answer: 'Once an order has been placed, it is immediately processed for shipping. Therefore, we are unable to modify or cancel orders after they have been submitted. Please review your order carefully before completing the purchase.' 
    },
    { 
      question: 'How long will it take to receive my order?', 
      answer: 'The delivery time depends on your location and the shipping method selected during checkout. Typically, orders are processed and shipped within 1-2 business days. You will receive a tracking number via email once your order has been dispatched.' 
    },
    { 
      question: 'What is your return policy?', 
      answer: 'We offer a 30-day return policy for most items. If you are not satisfied with your purchase, you may return the item(s) within 30 days of receipt for a full refund or exchange. Please note that certain items may be subject to restocking fees or ineligible for return.' 
    },
    {
        question: 'Do I need to have shipping information before buying a product?',
        answer: 'Yes, in order for us to know exactly where to send your products, we first need a valid shipping address.'
    }
  ];
  

  return (
    <div className="faq-container">
      <h1>FAQs</h1>
      {faqs.map((faq, index) => (
        <div className={`faq-item ${showAnswer[index] ? 'open' : ''}`} key={index}>
          <div 
            className="faq-question" 
            onClick={() => toggleAnswer(index)} 
          >
            {faq.question}
          </div>
          <div className="faq-answer">{faq.answer}</div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
