import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, Heart, Phone, Mail, MapPin, Clock, Stethoscope, Activity, Users } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m HealthLink Assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const chatEndRef = useRef(null);

  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    message: ''
  });

  const [volunteerForm, setVolunteerForm] = useState({
    fullName: '',
    skills: '',
    availability: '',
    location: ''
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSupportSubmit = async () => {
    if (!supportForm.name || !supportForm.email || !supportForm.phone || !supportForm.message) {
      showToastMessage('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supportForm.email)) {
      showToastMessage('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supportForm)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToastMessage('Thank you! Your request has been submitted successfully.');
        setSupportForm({
          name: '',
          email: '',
          phone: '',
          category: 'General Inquiry',
          message: ''
        });
      } else {
        showToastMessage(result.message || 'Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      showToastMessage('Network error. Please check if backend is running.');
    }
  };

  const handleVolunteerSubmit = async () => {
    if (!volunteerForm.fullName || !volunteerForm.skills || !volunteerForm.availability || !volunteerForm.location) {
      showToastMessage('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volunteerForm)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToastMessage('Thank you for volunteering! We will contact you soon.');
        setVolunteerForm({
          fullName: '',
          skills: '',
          availability: '',
          location: ''
        });
      } else {
        showToastMessage(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      showToastMessage('Network error. Please check if backend is running.');
    }
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages([...chatMessages, { type: 'user', text: userMessage }]);
    setChatInput('');

    setTimeout(() => {
      const botResponse = getBotResponse(userMessage);
      setChatMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 500);
  };

  const getBotResponse = (input) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('ambulance') || lowerInput.includes('emergency')) {
      return 'For emergencies, please call 102 (Ambulance) or 112 (Emergency Services) immediately. Stay calm and provide your exact location.';
    }
    
    if (lowerInput.includes('pharmacy') || lowerInput.includes('medicine')) {
      return 'Our partner pharmacies are open 24/7. The nearest pharmacy is HealthCare Plus at Main Street. You can also order medicines online through our app.';
    }
    
    if (lowerInput.includes('contact') || lowerInput.includes('reach')) {
      return 'You can reach us at:\n📞 Phone: +91-1234567890\n✉️ Email: support@healthlink.com\nOr fill out our Support Form for detailed assistance.';
    }
    
    if (lowerInput.includes('appointment') || lowerInput.includes('doctor')) {
      return 'To book an appointment with a doctor, please fill out our Support Form with "Medical Assistance" category, and our team will arrange a consultation for you.';
    }
    
    if (lowerInput.includes('volunteer') || lowerInput.includes('help')) {
      return 'That\'s wonderful! You can register as a volunteer through our Volunteer Registration form. We need help in medical support, logistics, and counseling.';
    }

    if (lowerInput.includes('hours') || lowerInput.includes('timing')) {
      return 'Our support team is available Monday to Saturday, 9 AM to 6 PM. For urgent matters, please use our 24/7 emergency contact: 102.';
    }

    return 'I\'m still learning. Would you like to fill out our Support Form for a human response? Our team will get back to you within 24 hours.';
  };

  const handleKeyPress = (e, submitFunction) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitFunction();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with Gradient */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <Heart className="text-red-500" size={36} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">HealthLink</h1>
              <p className="text-blue-100 text-sm">Your Healthcare Partner</p>
            </div>
          </div>
          <nav className="flex space-x-2 md:space-x-4 flex-wrap justify-center">
            {['home', 'support', 'volunteer', 'about'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-white text-blue-700 shadow-lg transform scale-105'
                    : 'text-white hover:bg-white/20 hover:scale-105'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-10 text-center border border-blue-100">
              <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6">
                <Stethoscope className="text-white" size={48} />
              </div>
              <h2 className="text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-4">
                Welcome to HealthLink
              </h2>
              <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                Your trusted partner in healthcare support. We connect patients with medical assistance
                and empower volunteers to make a difference in communities worldwide.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button
                  onClick={() => setActiveTab('support')}
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <span className="flex items-center justify-center">
                    <Phone className="mr-2 group-hover:animate-bounce" size={24} />
                    Get Support Now
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('volunteer')}
                  className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <span className="flex items-center justify-center">
                    <Users className="mr-2 group-hover:animate-bounce" size={24} />
                    Join as Volunteer
                  </span>
                </button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-500">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="text-blue-600" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">24/7 Emergency</h3>
                <p className="text-gray-600 leading-relaxed">Immediate assistance for urgent medical needs. Always here when you need us most.</p>
              </div>

              <div className="group bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-red-500">
                <div className="bg-gradient-to-br from-red-100 to-pink-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="text-red-600" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Volunteer Network</h3>
                <p className="text-gray-600 leading-relaxed">Join our community of caring volunteers making real impact in healthcare.</p>
              </div>

              <div className="group bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-green-500">
                <div className="bg-gradient-to-br from-green-100 to-emerald-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="text-green-600" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">AI Assistant</h3>
                <p className="text-gray-600 leading-relaxed">Instant answers to your health queries powered by intelligent automation.</p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8">
              <div className="grid md:grid-cols-3 gap-8 text-center text-white">
                <div>
                  <Activity className="mx-auto mb-3" size={48} />
                  <div className="text-4xl font-bold mb-2">10K+</div>
                  <div className="text-indigo-100">Patients Helped</div>
                </div>
                <div>
                  <Users className="mx-auto mb-3" size={48} />
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-indigo-100">Active Volunteers</div>
                </div>
                <div>
                  <Heart className="mx-auto mb-3" size={48} />
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-indigo-100">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-10 max-w-3xl mx-auto border border-blue-100 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
                <Phone className="text-white" size={40} />
              </div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
                Patient Support Form
              </h2>
              <p className="text-gray-600">We're here to help. Fill out the form and we'll get back to you soon.</p>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-gray-800 font-bold mb-2 text-sm uppercase tracking-wide">Name *</label>
                <input
                  type="text"
                  value={supportForm.name}
                  onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 font-medium"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-bold mb-2 text-sm uppercase tracking-wide">Email *</label>
                <input
                  type="email"
                  value={supportForm.email}
                  onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 font-medium"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-bold mb-2 text-sm uppercase tracking-wide">Phone Number *</label>
                <input
                  type="tel"
                  value={supportForm.phone}
                  onChange={(e) => setSupportForm({ ...supportForm, phone: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 font-medium"
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-bold mb-2 text-sm uppercase tracking-wide">Category *</label>
                <select
                  value={supportForm.category}
                  onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 font-medium bg-white"
                >
                  <option>General Inquiry</option>
                  <option>Medical Assistance</option>
                  <option>Urgent Support</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-800 font-bold mb-2 text-sm uppercase tracking-wide">Message *</label>
                <textarea
                  value={supportForm.message}
                  onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                  rows="5"
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 font-medium resize-none"
                  placeholder="Describe your situation or inquiry..."
                ></textarea>
              </div>

              <button
                onClick={handleSupportSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Submit Request
              </button>
            </div>
          </div>
        )}

        {activeTab === 'volunteer' && (
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-2xl p-10 max-w-3xl mx-auto border border-green-100 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
                <Users className="text-white" size={40} />
              </div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-2">
                Volunteer Registration
              </h2>
              <p className="text-gray-600">Join our mission to make healthcare accessible for everyone.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-gray-800 font-bold mb-2 text-sm uppercase tracking-wide">Full Name *</label>
                <input
                  type="text"
                  value={volunteerForm.fullName}
                  onChange={(e) => setVolunteerForm({ ...volunteerForm, fullName: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 text-gray-800 font-medium"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-bold mb-2 text-sm uppercase tracking-wide">Skills *</label>
                <select
                  value={volunteerForm.skills}
                  onChange={(e) => setVolunteerForm({ ...volunteerForm, skills: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 text-gray-800 font-medium bg-white"
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
                <label className="block text-gray-800 font-bold mb-2 text-sm uppercase tracking-wide">Availability *</label>
                <select
                  value={volunteerForm.availability}
                  onChange={(e) => setVolunteerForm({ ...volunteerForm, availability: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 text-gray-800 font-medium bg-white"
                >
                  <option value="">Select your availability</option>
                  <option>Weekdays</option>
                  <option>Weekends</option>
                  <option>Evenings</option>
                  <option>Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-800 font-bold mb-2 text-sm uppercase tracking-wide">Location *</label>
                <input
                  type="text"
                  value={volunteerForm.location}
                  onChange={(e) => setVolunteerForm({ ...volunteerForm, location: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 text-gray-800 font-medium"
                  placeholder="City, State"
                />
              </div>

              <button
                onClick={handleVolunteerSubmit}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Register as Volunteer
              </button>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-2xl p-10 border border-purple-100 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
                <Heart className="text-white" size={40} />
              </div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent mb-4">
                About HealthLink
              </h2>
            </div>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
              <p className="text-xl font-medium text-gray-800">
                HealthLink is a mini healthcare support platform designed to bridge the gap between
                patients seeking medical assistance and volunteers willing to help.
              </p>
              <p>
                Our mission is to provide immediate support through our AI-powered chatbot, connect
                patients with medical resources, and build a community of dedicated volunteers who
                can make a real difference in people's lives.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-10">
                <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Phone className="text-blue-600" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-800">Emergency Contact</h3>
                    <p className="text-gray-600">+91-1234567890 (24/7)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Mail className="text-green-600" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-800">Email Support</h3>
                    <p className="text-gray-600">support@healthlink.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <MapPin className="text-purple-600" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-800">Location</h3>
                    <p className="text-gray-600">123 Healthcare Avenue, Mumbai</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="text-orange-600" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-800">Office Hours</h3>
                    <p className="text-gray-600">Mon-Sat: 9 AM - 6 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Enhanced Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen && (
          <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden border-2 border-blue-200 animate-slide-up">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2 rounded-lg">
                  <MessageCircle className="text-blue-600" size={24} />
                </div>
                <div>
                  <span className="font-bold text-lg">HealthLink AI</span>
                  <div className="flex items-center space-x-1 text-xs text-blue-100">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="hover:bg-white/20 rounded-lg p-2 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="h-96 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-xs px-5 py-3 rounded-2xl whitespace-pre-line shadow-md ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border-2 border-gray-100 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            <div className="p-4 border-t-2 border-gray-100 bg-white">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleChatSubmit)}
                  placeholder="Type your message..."
                  className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-800 font-medium"
                />
                <button
                  onClick={handleChatSubmit}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                  <Send size={24} />
                </button>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-full shadow-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-110 animate-bounce-slow"
        >
          <MessageCircle size={32} />
        </button>
      </div>

      {/* Enhanced Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-2xl z-50 animate-slide-in font-bold text-lg border-2 border-white">
          ✓ {toastMessage}
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;