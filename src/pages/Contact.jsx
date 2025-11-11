import { useState } from "react";


export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission and send data to Webhook.site
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      const response = await fetch(
        "https://webhook.site/7071ea13-ca89-4e00-94d9-0a76c7f5625a",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.text(); // Webhook returns text
      console.log("Server response:", result); // See submission in console

      setSubmitted(true); // Show success message
      setFormData({ name: "", email: "", message: "" }); // Clear form
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <section className="section-contact container">
      <h2 className="container-title">Contact Us</h2>

      <div className="contact-wrapper container">
        <form onSubmit={handleFormSubmit} className="contact-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </label>

          <label>
            Message:
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Your message..."
            />
          </label>

          <button type="submit">Send Message</button>
        </form>

        {submitted && (
          <p className="success-message">
            Thank you! Your message has been sent.
          </p>
        )}
      </div>
    </section>
  );
};
