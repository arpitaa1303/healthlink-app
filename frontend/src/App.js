import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  X,
  MessageCircle,
  Heart,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

const App = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      text: "Hello! I'm HealthLink Assistant. How can I help you today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const chatEndRef = useRef(null);

  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "General Inquiry",
    message: "",
  });

  const [volunteerForm, setVolunteerForm] = useState({
    fullName: "",
    skills: "",
    availability: "",
    location: "",
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSupportSubmit = async () => {
    if (
      !supportForm.name ||
      !supportForm.email ||
      !supportForm.phone ||
      !supportForm.message
    ) {
      showToastMessage("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supportForm.email)) {
      showToastMessage("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supportForm),
      });

      const result = await response.json();

      if (result.success) {
        showToastMessage(
          "Thank you! Your request has been submitted successfully.",
        );
        setSupportForm({
          name: "",
          email: "",
          phone: "",
          category: "General Inquiry",
          message: "",
        });
      } else {
        showToastMessage(
          result.message || "Submission failed. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error:", error);
      showToastMessage("Network error. Please check if backend is running.");
    }
  };

  const handleVolunteerSubmit = async () => {
    if (
      !volunteerForm.fullName ||
      !volunteerForm.skills ||
      !volunteerForm.availability ||
      !volunteerForm.location
    ) {
      showToastMessage("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(volunteerForm),
      });

      const result = await response.json();

      if (result.success) {
        showToastMessage(
          "Thank you for volunteering! We will contact you soon.",
        );
        setVolunteerForm({
          fullName: "",
          skills: "",
          availability: "",
          location: "",
        });
      } else {
        showToastMessage(
          result.message || "Registration failed. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error:", error);
      showToastMessage("Network error. Please check if backend is running.");
    }
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages([...chatMessages, { type: "user", text: userMessage }]);
    setChatInput("");

    setTimeout(() => {
      const botResponse = getBotResponse(userMessage);
      setChatMessages((prev) => [...prev, { type: "bot", text: botResponse }]);
    }, 500);
  };

  const getBotResponse = (input) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("ambulance") || lowerInput.includes("emergency")) {
      return "For emergencies, please call 102 (Ambulance) or 112 (Emergency Services) immediately. Stay calm and provide your exact location.";
    }

    if (lowerInput.includes("pharmacy") || lowerInput.includes("medicine")) {
      return "Our partner pharmacies are open 24/7. The nearest pharmacy is HealthCare Plus at Main Street. You can also order medicines online through our app.";
    }

    if (lowerInput.includes("contact") || lowerInput.includes("reach")) {
      return "You can reach us at:\n📞 Phone: +91-1234567890\n✉️ Email: support@healthlink.com\nOr fill out our Support Form for detailed assistance.";
    }

    if (lowerInput.includes("appointment") || lowerInput.includes("doctor")) {
      return 'To book an appointment with a doctor, please fill out our Support Form with "Medical Assistance" category, and our team will arrange a consultation for you.';
    }

    if (lowerInput.includes("volunteer") || lowerInput.includes("help")) {
      return "That's wonderful! You can register as a volunteer through our Volunteer Registration form. We need help in medical support, logistics, and counseling.";
    }

    if (lowerInput.includes("hours") || lowerInput.includes("timing")) {
      return "Our support team is available Monday to Saturday, 9 AM to 6 PM. For urgent matters, please use our 24/7 emergency contact: 102.";
    }

    return "I'm still learning. Would you like to fill out our Support Form for a human response? Our team will get back to you within 24 hours.";
  };

  const handleKeyPress = (e, submitFunction) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitFunction();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold text-blue-900">HealthLink</h1>
          </div>
          <nav className="flex space-x-6">
            <button
              onClick={() => setActiveTab("home")}
              className={`font-medium transition ${
                activeTab === "home"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab("support")}
              className={`font-medium transition ${
                activeTab === "support"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Support Form
            </button>
            <button
              onClick={() => setActiveTab("volunteer")}
              className={`font-medium transition ${
                activeTab === "volunteer"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Volunteer
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`font-medium transition ${
                activeTab === "about"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              About
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "home" && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-4xl font-bold text-blue-900 mb-4">
                Welcome to HealthLink
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Your trusted partner in healthcare support. We connect patients
                with medical assistance and empower volunteers to make a
                difference.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setActiveTab("support")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Get Support
                </button>
                <button
                  onClick={() => setActiveTab("volunteer")}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Become a Volunteer
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Phone className="mx-auto text-blue-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">24/7 Emergency</h3>
                <p className="text-gray-600">
                  Immediate assistance for urgent medical needs
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Heart className="mx-auto text-red-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">
                  Volunteer Network
                </h3>
                <p className="text-gray-600">
                  Join our community of caring volunteers
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <MessageCircle
                  className="mx-auto text-green-600 mb-4"
                  size={48}
                />
                <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
                <p className="text-gray-600">
                  Instant answers to your health queries
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "support" && (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              Patient Support Form
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={supportForm.name}
                  onChange={(e) =>
                    setSupportForm({ ...supportForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={supportForm.email}
                  onChange={(e) =>
                    setSupportForm({ ...supportForm, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={supportForm.phone}
                  onChange={(e) =>
                    setSupportForm({ ...supportForm, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category *
                </label>
                <select
                  value={supportForm.category}
                  onChange={(e) =>
                    setSupportForm({ ...supportForm, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>General Inquiry</option>
                  <option>Medical Assistance</option>
                  <option>Urgent Support</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Message *
                </label>
                <textarea
                  value={supportForm.message}
                  onChange={(e) =>
                    setSupportForm({ ...supportForm, message: e.target.value })
                  }
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                onClick={handleSupportSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Submit Request
              </button>
            </div>
          </div>
        )}

        {activeTab === "volunteer" && (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              Volunteer Registration
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={volunteerForm.fullName}
                  onChange={(e) =>
                    setVolunteerForm({
                      ...volunteerForm,
                      fullName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Skills *
                </label>
                <select
                  value={volunteerForm.skills}
                  onChange={(e) =>
                    setVolunteerForm({
                      ...volunteerForm,
                      skills: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select your skills</option>
                  <option>Medical</option>
                  <option>Logistics</option>
                  <option>Counseling</option>
                  <option>Administrative</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Availability *
                </label>
                <select
                  value={volunteerForm.availability}
                  onChange={(e) =>
                    setVolunteerForm({
                      ...volunteerForm,
                      availability: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select your availability</option>
                  <option>Weekdays</option>
                  <option>Weekends</option>
                  <option>Evenings</option>
                  <option>Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={volunteerForm.location}
                  onChange={(e) =>
                    setVolunteerForm({
                      ...volunteerForm,
                      location: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City, State"
                />
              </div>

              <button
                onClick={handleVolunteerSubmit}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Register as Volunteer
              </button>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              About HealthLink
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                HealthLink is a mini healthcare support platform designed to
                bridge the gap between patients seeking medical assistance and
                volunteers willing to help.
              </p>
              <p>
                Our mission is to provide immediate support through our
                AI-powered chatbot, connect patients with medical resources, and
                build a community of dedicated volunteers who can make a real
                difference in people's lives.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-start space-x-3">
                  <Phone className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold mb-1">Emergency Contact</h3>
                    <p>+91-1234567890 (24/7)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold mb-1">Email Support</h3>
                    <p>support@healthlink.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p>123 Healthcare Avenue, Mumbai</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold mb-1">Office Hours</h3>
                    <p>Mon-Sat: 9 AM - 6 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen && (
          <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <MessageCircle size={24} />
                <span className="font-semibold">HealthLink Assistant</span>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="hover:bg-blue-700 rounded p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg whitespace-pre-line ${
                      msg.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 shadow"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleChatSubmit)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleChatSubmit}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <MessageCircle size={28} />
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default App;
