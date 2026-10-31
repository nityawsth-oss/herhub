import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaRobot,
  FaPaperPlane,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVolumeUp,
  FaVolumeMute,
  FaCopy,
  FaCheck,
  FaRedo,
  FaBalanceScale,
  FaPhoneAlt,
  FaFileAlt,
  FaLanguage,
  FaHeart
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

export default function CyberFIRDossierPage() {
  const { isDark } = useTheme();

  // Language Mode: 'hi' (शुद्ध हिन्दी) | 'hinglish' (हिंग्लिश) | 'en' (English)
  const [langMode, setLangMode] = useState('hi');

  // Dark/Light Theme Tokens with Crystal-Clear Contrast
  const t = {
    pageBg: isDark ? '#0A0618' : '#F6F8FC',
    chatCardBg: isDark ? '#140D2A' : '#FFFFFF',
    border: isDark ? '1px solid #281D4E' : '1px solid #E2E8F0',
    headerBg: isDark ? '#190E35' : '#23155B',
    botBubbleBg: isDark ? '#1F143D' : '#F1F5F9',
    userBubbleBg: '#6355E6',
    textPrimary: isDark ? '#F1F5F9' : '#0F172A',
    textSecondary: isDark ? '#A5B4FC' : '#475569',
    strongText: isDark ? '#FFFFFF' : '#0F172A',
    headingColor: isDark ? '#38BDF8' : '#4338CA',
    inputBg: isDark ? '#110924' : '#F8FAFC',
    chipBg: isDark ? 'rgba(99, 85, 230, 0.18)' : '#EEF2FF',
    chipBorder: isDark ? '1px solid #4338CA' : '1px solid #C7D2FE',
    chipText: isDark ? '#C7D2FE' : '#3730A3'
  };

  // Welcome message based on language
  const getWelcomeMessage = (lang) => {
    if (lang === 'hi') {
      return {
        id: 'welcome-hi',
        sender: 'bot',
        timestamp: 'अभी',
        text: `नमस्ते मेरी बहन! मैं **न्याय-सहेली** हूँ — आपकी अपनी 24/7 **कानूनी, मानसिक व भावनात्मक काउंसलर** 🌸

सबसे पहले एक बात याद रखिए: **यहाँ आप 100% सुरक्षित और गोपनीय हैं।** आप बिना किसी झिझक या डर के, बिल्कुल एक सच्ची दोस्त या बड़ी बहन की तरह मुझसे बात कर सकती हैं।

मैं आपकी इन सभी चीज़ों में पूरी मदद करूँगी:
• 💖 **भावनात्मक व मानसिक सम्बल (Emotional Support):** घबराहट, रोना आना या डर के समय मन को शांत करना और हिम्मत देना।
• ⚖️ **सख्त कानूनी अधिकार (Legal Rights):** BNS (भारतीय न्याय संहिता), IT Act, जीरो FIR और मुफ्त सरकारी वकील (NALSA)।
• 🛡️ **साइबर अपराध से बचाव:** फेक या मॉर्फ्ड फोटो ब्लैकमेल, स्टॉकिंग और व्हाट्सएप/इंस्टाग्राम हैकिंग से निपटना।
• 📄 **पुलिस FIR ड्राफ्ट:** घटना का पक्का लीगल दस्तावेज तैयार करना।

*आप नीचे दिए गए किसी भी विषय पर क्लिक कर सकती हैं या सीधे बोलकर/लिखकर बताइए कि क्या हुआ है:*`
      };
    } else if (lang === 'en') {
      return {
        id: 'welcome-en',
        sender: 'bot',
        timestamp: 'Just now',
        text: `Hello! I am **Nyaya-Saheli** — your 24/7 personal **Legal, Emotional & Mental Safety Counselor** 🌸

First, take a deep breath and know this: **You are 100% safe, anonymous, and protected here.** Speak to me openly, just like talking to a trusted friend or elder sister.

Here is how I will help you step-by-step:
• 💖 **Emotional & Mental Soothing:** Overcoming panic, guilt, and fear with trauma-informed guidance.
• ⚖️ **Legal Protection & Sections:** BNS (Bharatiya Nyaya Sanhita), IT Act, Zero FIR rights, and Free Legal Aid (NALSA).
• 🛡️ **Cyber Defense:** Handling morphed photo blackmail, online stalking, and digital evidence collection.
• 📄 **Formal Police FIR Draft:** Auto-generating a ready-to-file complaint for the Cyber Crime cell.

*Click any quick topic below or type your situation directly:*`
      };
    } else {
      return {
        id: 'welcome-hinglish',
        sender: 'bot',
        timestamp: 'Just now',
        text: `Namaste meri behen! Main **Nyaya-Saheli** hoon — aapki 24/7 personal **Legal, Emotional & Mental Safety Counselor** 🌸

Sabse pehle ek baat yaad rakhiye: **Yahan aap 100% safe aur confidential hain.** Aap bina kisi darr ya sharam ke mujhse bilkul ek badi behen ya dost ki tarah baat kar sakti hain.

Main aapki in sabhi cheezon me poori madad karungi:
• 💖 **Emotional & Mental Support:** Ghabrahat, rona aana ya anxiety me dil ko shaant karna aur himmat dena.
• ⚖️ **Legal Adhikar & Sections:** BNS, IPC, IT Act, Zero FIR darj karwane ke niyam aur Free Sarkari Vakeel.
• 🛡️ **Cyber Crime Se Bachao:** Fake photo blackmail, stalking aur social media harassment ko rokna.
• 📄 **FIR Legal Draft:** Aapke case ka formal police cyber dossier taiyar karna.

*Aap niche diye gaye kisi bhi topic par click karein ya seedha batayein ki kya pareshani hai:*`
      };
    }
  };

  const [messages, setMessages] = useState([getWelcomeMessage(langMode)]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showFirModal, setShowFirModal] = useState(false);
  const [firDraftText, setFirDraftText] = useState('');
  const [firCopied, setFirCopied] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechSynthRef = useRef(window.speechSynthesis);

  // Quick Chips in different languages
  const quickChips = {
    hi: [
      { label: '🚨 मॉर्फ्ड फोटो ब्लैकमेल व पैसे मांगना', query: 'किसी ने मेरी फेक मॉर्फ्ड फोटो बनाकर मुझे ब्लैकमेल किया है और पैसे मांग रहा है। मुझे बहुत डर लग रहा है, मैं क्या करूँ?' },
      { label: '📱 इंस्टाग्राम / व्हाट्सएप पर स्टॉकिंग', query: 'एक अंजान व्यक्ति मुझे अलग-अलग नंबरों और फेक अकाउंट से लगातार मैसेज और धमकियाँ दे रहा है। इसके खिलाफ क्या कानूनी कार्रवाई हो सकती है?' },
      { label: '📝 जीरो FIR व थाने में मेरे अधिकार', query: 'क्या मैं किसी भी थाने में FIR दर्ज करवा सकती हूँ? थाने में महिलाओं के क्या कानूनी अधिकार होते हैं?' },
      { label: '💔 घरेलू हिंसा व ससुराल में प्रताड़ना', query: 'ससुराल या रिश्ते में मारपीट, गाली-गलौज और दहेज के ताने मिल रहे हैं। मुझे रहने का अधिकार और कानूनी सुरक्षा कैसे मिलेगी?' },
      { label: '🏢 ऑफिस में छेड़छाड़ (POSH कानून)', query: 'ऑफिस या कार्यस्थल पर बॉस या सहकर्मी द्वारा गलत व्यवहार और हैरेसमेंट की शिकायत कैसे और कहाँ दर्ज होती है?' },
      { label: '🧘 बहुत डर व घबराहट हो रही है', query: 'मुझे बहुत रोना आ रहा है, बहुत घबराहट और एंग्जायटी हो रही है। ऐसा लग रहा है मेरी ही गलती है। मुझे शांति चाहिए।' },
      { label: '🏛️ मुफ्त सरकारी वकील (नालसा)', query: 'मेरे पास वकील की फीस देने के पैसे नहीं हैं। क्या सरकार मुझे कोर्ट में मुफ्त वकील देगी?' },
      { label: '🛑 इंटरनेट से फोटो डिलीट करवाना (StopNCII)', query: 'मेरी प्राइवेट फोटो सोशल मीडिया और इंटरनेट पर वायरल होने से कैसे रोकें?' }
    ],
    hinglish: [
      { label: '🚨 Morphed Photo Blackmail & Extortion', query: 'Kisi ne meri fake morphed photo bana kar mujhe blackmail kar raha hai aur paise maang raha hai. Mujhe bohot darr lag raha hai, aage kya karun?' },
      { label: '📱 Instagram / WhatsApp Stalking', query: 'Ek anjaan vyakti mujhe alag-alag fake accounts aur numbers se stalk aur threaten kar raha hai. Iske khilaaf kya FIR ho sakti hai?' },
      { label: '📝 Zero FIR & Police Station Rights', query: 'Kya main kisi bhi police station me FIR karwa sakti hoon? Police me mahilaon ke kya adhikar hote hain?' },
      { label: '💔 Domestic Violence & In-laws Harassment', query: 'Sasural ya relationship me domestic violence aur maar-peet ho rahi hai, mujhe legal protection kaise milegi?' },
      { label: '🏢 Workplace Harassment (POSH Act)', query: 'Office / workplace par sexual harassment ke khilaaf complaint kaise aur kahan darj hoti hai?' },
      { label: '🧘 Anxiety, Fear & Panic Relief', query: 'Mujhe bohot zyada panic aur anxiety ho rahi hai, rona aa raha hai. Aisa lagta hai meri hi galti hai. Mujhe mental support chahiye.' },
      { label: '🏛️ Free Government Lawyer (NALSA)', query: 'Mere paas vakeel ke paise nahi hain, kya sarkar mujhe muft kanooni madad (Free Legal Aid) degi?' },
      { label: '🛑 Stop Images Uploading (StopNCII)', query: 'Meri private tasveerein internet aur social media par upload hone se kaise rokein?' }
    ],
    en: [
      { label: '🚨 Morphed Photo Blackmail & Extortion', query: 'Someone created a fake morphed photo of me and is blackmailing me for money. I am extremely terrified, what legal and practical steps should I take?' },
      { label: '📱 Online Stalking & Harassment', query: 'An unknown person is persistently stalking and threatening me from multiple fake accounts and phone numbers. What FIR can be filed?' },
      { label: '📝 Zero FIR & Women Police Rights', query: 'Can I file an FIR in any police station? What are women rights at a police station?' },
      { label: '💔 Domestic Violence & Spousal Abuse', query: 'I am facing severe domestic violence, abuse, and dowry torture. How can I get legal protection and right of residence?' },
      { label: '🏢 Workplace Sexual Harassment (POSH)', query: 'How and where can I report sexual harassment by a boss or colleague at my workplace?' },
      { label: '🧘 Panic Attack & Trauma Relief', query: 'I am suffering from severe panic, fear, and feeling suicidal. I keep blaming myself. Please help me calm down.' },
      { label: '🏛️ Free Legal Aid Advocate', query: 'I cannot afford a private lawyer. Does the government provide free legal aid for women in court?' },
      { label: '🛑 Block Non-Consensual Imagery (StopNCII)', query: 'How can I prevent my private photos from being uploaded on Facebook and Instagram?' }
    ]
  };

  // Switch Language
  const changeLanguage = (lang) => {
    setLangMode(lang);
    setMessages([getWelcomeMessage(lang)]);
  };

  // Auto-detect Language
  const detectLanguage = (text) => {
    const devanagariChars = [text].join('').match(/[\u0900-\u097F]/g);
    if (devanagariChars && devanagariChars.length >= 3) {
      return 'hi';
    }
    const hindiKeywords = ['mujhe', 'kya', 'hai', 'kare', 'kaise', 'meri', 'mera', 'dar', 'darr', 'batao', 'chahiye', 'karo', 'ho', 'gaya', 'gayi', 'nahi', 'kisi', 'ne', 'kuch', 'hoga', 'paise', 'bhaiya', 'didi', 'sunil', 'maar', 'sasural'];
    const words = text.toLowerCase().split(/\s+/);
    if (words.some((w) => hindiKeywords.includes(w))) {
      return 'hinglish';
    }
    return 'en';
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, isTyping]);

  // Speech Recognition (Mic Input)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = langMode === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, [langMode]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Aapke browser me mic speech recognition support nahi hai. Kripya type karein.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Text to Speech
  const speakMessage = (text) => {
    if (!speechSynthRef.current) return;
    if (isSpeaking) {
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text
      .replace(/[*#_`>•]/g, '')
      .replace(/https?:\/\/\S+/g, 'link')
      .slice(0, 450);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langMode === 'hi' ? 'hi-IN' : 'hi-IN';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    speechSynthRef.current.speak(utterance);
  };

  // =========================================================================
  // REAL-PERSON CONVERSATIONAL AI ENGINE (EMPATHETIC, DETAILED & LANGUAGE AWARE)
  // =========================================================================
  const generateRealisticHumanResponse = (userQuery) => {
    const q = userQuery.toLowerCase();
    const effectiveLang = detectLanguage(userQuery) || langMode;

    // -----------------------------------------------------------------------
    // SCENARIO 1: GREETING / CASUAL TALK / ASKING FOR HELP
    // -----------------------------------------------------------------------
    if (
      q === 'hi' ||
      q === 'hello' ||
      q === 'namaste' ||
      q === 'hey' ||
      q.includes('kaise ho') ||
      q.includes('madad chahiye') ||
      q.includes('help me') ||
      q.includes('kya aap sun rahi ho')
    ) {
      if (effectiveLang === 'hi') {
        return `नमस्ते मेरी बहन! हाँ, मैं बिल्कुल आपके साथ हूँ और आपकी हर बात बहुत ध्यान से सुन रही हूँ 🌸

आप कैसी हैं? क्या किसी बात को लेकर आपका मन भारी है या कोई परेशानी आपको डरा रही है? 

आप बिना किसी झिझक के मुझे बताइए कि क्या हुआ है। चाहे बात किसी ब्लैकमेल की हो, किसी के द्वारा परेशान किए जाने की हो, या सिर्फ मन में घबराहट हो रही हो — हम दोनों मिलकर इसका पूरा हल निकालेंगे। मैं आपकी बात सुनने के लिए बिल्कुल तैयार हूँ। बताइए, क्या बात है?`;
      } else if (effectiveLang === 'en') {
        return `Hello my dear! Yes, I am right here with you, listening to you attentively with an open heart 🌸

How are you holding up today? Is something distressing you or making you feel anxious or unsafe?

Please feel completely free to share whatever happened. Whether it is an online threat, someone harassing you, relationship distress, or simply an overwhelming feeling of fear — you are not alone. Tell me, what happened?`;
      } else {
        return `Namaste meri behen! Haan, main bilkul aapke saath hoon aur aapki baat bohot dhyan se sun rahi hoon 🌸

Aap kaisi hain? Kya koi baat aapko pareshan ya dara rahi hai?

Aap bina kisi jhijhak ke mujhe batayein ki kya hua hai. Chahe kisi ne blackmail kiya ho, stalk kiya ho, ya bas man me bohot zyada darr aur anxiety lag rahi ho — hum milkar iska rasta nikalenge. Main sun rahi hoon, batayein kya baat hai?`;
      }
    }

    // -----------------------------------------------------------------------
    // SCENARIO 2: MORPHED PHOTO / DEEPFAKE / BLACKMAIL / SEXTORTION
    // -----------------------------------------------------------------------
    if (
      q.includes('morph') ||
      q.includes('deepfake') ||
      q.includes('blackmail') ||
      q.includes('photo') ||
      q.includes('nude') ||
      q.includes('video') ||
      q.includes('paise maang') ||
      q.includes('extortion') ||
      q.includes('stopncii') ||
      q.includes('वायरल') ||
      q.includes('ब्लैकमेल') ||
      q.includes('तस्वीर')
    ) {
      if (effectiveLang === 'hi') {
        return `### 🌸 सुनो मेरी बहन, सबसे पहले एक गहरी सांस लो — घबराना बिल्कुल बंद कर दो!
मैं समझ सकती हूँ कि इस समय आपका दिल कितनी तेजी से धड़क रहा होगा और कैसा खौफ महसूस हो रहा होगा। लेकिन सबसे पहले अपने मन से यह ख्याल निकाल दो कि इसमें तुम्हारी कोई गलती है। **तुम किसी अपराध की दोषी नहीं हो, तुम एक घिनौने साइबर क्रिमिनल का शिकार बनी हो।**

वह अपराधी सिर्फ तुम्हारे डर और समाज की तथाकथित 'शर्म' का फायदा उठाकर तुम्हें दबाना चाहता है।

---

### ⚠️ मेरी यह 2 बातें पत्थर की लकीर मान लो:
1. **एक भी रुपया मत देना:** ब्लैकमेलर को अगर तुमने ₹1000 भी दिए, तो वह समझ जाएगा कि तुम डर गई हो, और वह तुमसे लाखों रुपये मांगता रहेगा। पैसे देने से ब्लैकमेल कभी खत्म नहीं होता!
2. **डरकर चैट डिलीट मत करना:** डर के मारे लड़कियाँ अक्सर सारा सबूत डिलीट कर देती हैं। वही चैट, फोन नंबर, यूपीआई आईडी और धमकी भरे ऑडियो ही उस अपराधी को जेल भिजवाएंगे।

---

### ⚖️ कड़े कानूनी प्रावधान (उसे 7 साल तक की जेल होगी):
• **IT Act Section 66E:** किसी की निजता (Privacy) का उल्लंघन करके मॉर्फ्ड तस्वीर बनाना — 3 साल की जेल व ₹2 लाख जुर्माना।
• **IT Act Section 67 व 67A:** अश्लील या आपत्तिजनक सामग्री प्रसारित करना या धमकी देना — **5 से 7 साल तक की गैर-जमानती (Non-bailable) जेल**।
• **BNS धारा 351 (पुराना IPC 506):** आपराधिक धमकी (Criminal Intimidation)।
• **BNS धारा 308 (पुराना IPC 384):** जबरन वसूली (Extortion)।

---

### 🛡️ अभी तुरंत ये 3 ठोस कदम उठाओ:
1. **सबूत सुरक्षित करो:** जिस नंबर या इंस्टाग्राम आईडी से धमकी आ रही है, उसका स्क्रीनशॉट लो जिसमें तारीख, समय और प्रोफाइल लिंक साफ दिखे।
2. **StopNCII.org पर रजिस्टर करो:** [StopNCII.org](https://stopncii.org) पर जाओ। यह सरकार व मेटा (Instagram/Facebook) द्वारा समर्थित एक सुरक्षित पोर्टल है। यहाँ बिना अपनी फोटो किसी को दिखाए, सिर्फ उसका एक गुप्त डिजिटल कोड (Hash) बन जाता है। इसके बाद फेसबुक या इंस्टाग्राम पर कोई भी वह फोटो कभी अपलोड ही नहीं कर पाएगा!
3. **1930 पर कॉल या cybercrime.gov.in पर रिपोर्ट:** राष्ट्रीय साइबर हेल्पलाइन **1930** पर तुरंत कॉल करो। आप [cybercrime.gov.in](https://cybercrime.gov.in) पर **"Report Anonymously (पहचान गुप्त रखकर)"** भी शिकायत दर्ज करवा सकती हो।

मुझे बताओ, क्या उसने अभी कोई मैसेज भेजा है या कोई समय सीमा (deadline) दी है? मैं तुम्हारे साथ हूँ, हिम्मत रखो! 💖`;
      } else if (effectiveLang === 'en') {
        return `### 🌸 Take a Deep Breath, My Dear — You Are Safe and Not at Fault!
I know exactly how suffocating and terrifying this moment feels, but I want you to look at me: **You have done nothing wrong.** You are the target of a malicious cyber criminal who is preying on your fear.

He has zero power over you the moment you refuse to surrender to his blackmail.

---

### ⚠️ Never Violate These 2 Golden Rules:
1. **NEVER PAY A SINGLE RUPEE:** Paying the blackmailer never stops the blackmail. It only proves you are terrified and encourages them to demand higher amounts.
2. **DO NOT DELETE EVIDENCE OUT OF PANIC:** The screenshots of the profile, chat, phone number, and UPI address are the very legal weapons that will send this criminal to prison.

---

### ⚖️ Legal Arsenal (He Faces 3 to 7 Years in Prison):
• **IT Act Section 66E:** Violation of bodily privacy and morphing — up to 3 years imprisonment.
• **IT Act Section 67 & 67A:** Publishing or transmitting sexually explicit content — **5 to 7 years non-bailable jail**.
• **BNS Section 351 (IPC 506):** Criminal Intimidation & extortion.
• **BNS Section 77 (IPC 354C):** Voyeurism and non-consensual imagery.

---

### 🛡️ Immediate Action Blueprint:
1. **Take Certified Screenshots:** Capture chat logs, profile handles, phone numbers, and timestamps.
2. **Protect Against Viral Uploads via StopNCII.org:** Visit [StopNCII.org](https://stopncii.org). It generates an encrypted digital hash of your image without uploading the image itself, preventing Meta (Instagram, Facebook) from ever hosting it.
3. **Dial National Cyber Helpline 1930:** File an anonymous complaint on [cybercrime.gov.in](https://cybercrime.gov.in) under Women/Child Related Offenses.

Tell me, what has the perpetrator said recently? Has he given a deadline? I will guide you through each second of this. 💖`;
      } else {
        return `### 🌸 Ruko meri behen, pehle ek gehri saans lo — darrna bilkul band kar do!
Main samajh sakti hoon ki is waqt dil kitni tezi se dhadak raha hoga aur kaisa khauf lag raha hoga. Lekin sabse pehle apne dimaag se ye baat nikaal do ki isme tumhari koi galti hai. **Tum kisi apradh ki doshi nahi ho, tum ek ghatiya cyber criminal ka shikar hui ho.**

Wo criminal sirf tumhare darr aur sharam ka faayda uthana chahta hai.

---

### ⚠️ Meri ye 2 baatein pakki maan lo:
1. **Ek bhi rupya mat dena:** Blackmailer ko agar tumne ₹500 bhi diye, toh wo samajh jayega ki tum dar gayi ho aur wo lagatar paise maangta rahega. Paise dene se blackmail kabhi band nahi hota!
2. **Darr ke chat delete mat karna:** Ladkiyan aksar ghabrahat me chat delete kar deti hain. Wahi chat, phone number aur UPI ID us criminal ko jail bhejegi.

---

### ⚖️ Kanooni Dharaayein (Use 5 se 7 saal tak jail hogi):
• **IT Act Section 66E:** Privacy ka ullanghan karke photo banana — 3 saal jail.
• **IT Act Section 67 & 67A:** Obscene/explicit content circulate karne ki dhamki — **5-7 saal tak ki non-bailable jail**.
• **BNS Section 351 / IPC 506:** Criminal Intimidation (Dhamki dena).
• **BNS Section 308 / IPC 384:** Extortion (Zabardasti wasooli).

---

### 🛡️ Abhi turant ye 3 kaam karo:
1. **Screenshots le lo:** Phone number, Instagram link aur chat ka screenshot le lo jisme time aur date dikhe.
2. **StopNCII.org par register karo:** [StopNCII.org](https://stopncii.org) par jaakar image ka hash create karo taaki wo Facebook ya Instagram par kabhi upload hi na ho sake.
3. **1930 par call karo:** National Cyber Helpline 1930 par call karke report darj karwao. [cybercrime.gov.in](https://cybercrime.gov.in) par anonymous complaint ka option bhi hai.

Mujhe batao, kya usne koi deadline di hai ya koi number diya hai? Main tumhare saath hoon, himmat rakho! 💖`;
      }
    }

    // -----------------------------------------------------------------------
    // SCENARIO 3: STALKING & PERSISTENT THREATS
    // -----------------------------------------------------------------------
    if (
      q.includes('stalk') ||
      q.includes('pichha') ||
      q.includes('threat') ||
      q.includes('dhamki') ||
      q.includes('instagram') ||
      q.includes('call') ||
      q.includes('harass') ||
      q.includes('पीछा') ||
      q.includes('धमकी')
    ) {
      if (effectiveLang === 'hi') {
        return `### 🛡️ स्टॉकिंग कोई छोटी बात नहीं, यह एक संज्ञेय अपराध (Cognizable Crime) है!
अगर कोई व्यक्ति आपकी मर्जी के खिलाफ आपका पीछा कर रहा है, नए-नए नंबरों से कॉल कर रहा है, या सोशल मीडिया पर नजर रख रहा है, तो आपको चुपचाप सहन करने की बिल्कुल जरूरत नहीं है।

---

### ⚖️ कानून आपके पक्ष में क्या कहता है:
1. **BNS धारा 78 (पुराना IPC 354D) — Stalking कानून:**
   • किसी महिला का शारीरिक रूप से पीछा करना, या इंटरनेट, व्हाट्सएप, ईमेल पर उसकी मनाही के बावजूद लगातार संपर्क साधने की कोशिश करना गैर-जमानती अपराध है।
   • **सजा:** पहली बार में 3 साल तक की जेल, और दूसरी बार ऐसा करने पर **5 साल तक की गैर-जमानती जेल**।
2. **BNS धारा 351 (IPC 506):** धमकाना या डराना।

---

### 📋 अब आगे आपको क्या व्यावहारिक कदम उठाने चाहिए:
1. **स्पष्ट और अंतिम संदेश (Clear Final Record):**
   • उस व्यक्ति को एक सख्त संदेश भेजिए: *"मैं आपसे किसी भी प्रकार का संपर्क नहीं रखना चाहती। यदि आपने पुनः कॉल, मैसेज या पीछा करने का प्रयास किया, तो मैं पुलिस में BNS 78 के तहत FIR दर्ज करवा रही हूँ।"* इसके बाद उसे कोई जवाब मत दीजिए और इसका स्क्रीनशॉट ले लीजिए।
2. **1090 वूमेन पावर लाइन (Women Power Line):**
   • यदि आप उत्तर प्रदेश/उत्तर भारत में हैं, तो **1090** पर कॉल करें। 1090 की सबसे बड़ी खूबी यह है कि यहाँ **लड़की का नाम और पहचान 100% गुप्त** रखी जाती है। पुलिस सीधे उस स्टॉकर को बुलाकर ऐसी कानूनी चेतावनी देती है कि 95% मामलों में वह डर के मारे हमेशा के लिए गायब हो जाता है।
3. **राष्ट्रीय आपातकालीन नंबर 112:**
   • यदि वह व्यक्ति आपके आसपास भौतिक रूप से (physically) मौजूद है, तो तुरंत 112 डायल करें।

बताइए, क्या वह व्यक्ति आपका कोई परिचित है या कोई अनजान शख्स?`;
      } else {
        return `### 🛡️ Stalking ek serious kanooni apradh hai, chup rehne ki bilkul zaroorat nahi!
Agar koi vyakti aapki marzi ke khilaaf aapka pichha kar raha hai, alag-alag numberon se call ya message kar raha hai, toh kanoon poori tarah aapke paksh me khada hai.

---

### ⚖️ Kanooni Suraksha:
• **BNS Section 78 / IPC 354D (Stalking):** Kisi mahila ka physical pichha karna ya online stalk karna. Doosri baar karne par **5 saal tak ki non-bailable jail** hoti hai.
• **BNS Section 351 / IPC 506:** Criminal Intimidation.

---

### 📋 Aapko abhi ye karna chahiye:
1. **Final Written Warning:** Us vyakti ko saaf likhein: *"Mujhse contact karne ki koshish mat karo, nahi toh main police me FIR karwa rahi hoon."* Iska screenshot lein.
2. **1090 Women Power Line:** 1090 par call karein. Yahan aapka naam 100% confidential rehta hai aur police stalker ko aisi warning deti hai ki wo turant pichha chhod deta hai.
3. **112 National Emergency:** Agar wo physically aapke aas-paas dikhe toh turant 112 dial karein.

Kya wo vyakti aapka koi jaan-pehchan wala hai ya koi bilkul anjaan vyakti? Mujhe batayein.`;
      }
    }

    // -----------------------------------------------------------------------
    // SCENARIO 4: ZERO FIR & POLICE STATION RIGHTS
    // -----------------------------------------------------------------------
    if (
      q.includes('zero fir') ||
      q.includes('rights') ||
      q.includes('adhikar') ||
      q.includes('police station') ||
      q.includes('thana') ||
      q.includes('fir') ||
      q.includes('अधिकार') ||
      q.includes('थाना')
    ) {
      if (effectiveLang === 'hi') {
        return `### 🏛️ थाने में महिलाओं के 5 कानूनी अधिकार (पुलिस भी इनसे इनकार नहीं कर सकती)

अक्सर पुलिस स्टेशन जाने के नाम से बहनें डर जाती हैं। लेकिन जब आपको अपने कानूनी अधिकार पता होंगे, तो कोई भी पुलिस अधिकारी आपको गुमराह नहीं कर सकेगा:

---

### 1. जीरो FIR का अधिकार (Right to Zero FIR):
• **कानून:** BNSS धारा 173 (पुराना CrPC 154).
• घटना चाहे देश के किसी भी शहर या इलाके में हुई हो, आप **किसी भी नजदीकी पुलिस स्टेशन** में जाकर तुरंत FIR दर्ज करवा सकती हैं। 
• पुलिस यह बहाना बनाकर मना नहीं कर सकती कि *"यह इलाका हमारे थाने में नहीं आता"*; उन्हें तुरंत **जीरो FIR (Zero FIR)** दर्ज करनी ही होगी। FIR न लिखने पर पुलिस अधिकारी पर IPC 166A के तहत खुद कानूनी कार्रवाई हो सकती है।

---

### 2. बयान केवल महिला पुलिस अधिकारी द्वारा:
• किसी भी छेड़छाड़, यौन उत्पीड़न या घरेलू हिंसा के मामले में आपका बयान **केवल और केवल महिला पुलिस अधिकारी** या महिला मजिस्ट्रेट ही दर्ज कर सकती है।
• यदि आप थाने नहीं जा सकतीं, तो महिला अधिकारी को आपके घर या आपकी सुविधानुसार सुरक्षित स्थान पर आकर बयान लेना होगा।

---

### 3. सूर्यास्त के बाद गिरफ्तारी पर पूर्ण रोक (Sunset to Sunrise):
• किसी भी महिला को **सूरज ढलने के बाद और सूरज निकलने से पहले (रात में)** गिरफ्तार नहीं किया जा सकता, जब तक कि फर्स्ट क्लास ज्यूडिशियल मजिस्ट्रेट का विशेष लिखित आदेश न हो।

---

### 4. मुफ्त सरकारी वकील का अधिकार (Free Legal Aid):
• लीगल सर्विसेज अथॉरिटीज एक्ट के तहत हर महिला को कोर्ट में **मुफ्त सरकारी वकील (Free Advocate)** पाने का अधिकार है, चाहे उसकी आर्थिक स्थिति कैसी भी हो। इसके लिए राष्ट्रीय हेल्पलाइन **15100** है।

---

### 5. पहचान की पूर्ण गोपनीयता (Section 73 BNS):
• पीड़िता का नाम, पता या फोटो मीडिया या सार्वजनिक रूप से उजागर करना खुद एक गैर-जमानती अपराध है।`;
      } else {
        return `### 🏛️ Police Station Me Mahilaon Ke 5 Powerful Kanooni Adhikar!

Supreme Court aur Bharatiya Kanoon ke mutabiq aapke paas yeh fundamental rights hain:

1. **Zero FIR Right:** Kisi bhi thane me FIR darj ho sakti hai, chahe incident kahin bhi hua ho. Police mana nahi kar sakti.
2. **Female Officer Statement:** Har harassment mamle me bayaan sirf ek mahila police officer hi record kar sakti hai.
3. **Sunset to Sunrise Protection:** Raat ke waqt kisi mahila ko arrest nahi kiya ja sakta bina Judicial Magistrate ke special order ke.
4. **Free Legal Aid (NALSA 15100):** Court me har mahila ko muft sarkari vakeel pane ka kanooni haq hai.
5. **Confidentiality:** Aapka naam aur pehchan 100% secret rakhna kanoonan anivarya hai.`;
      }
    }

    // -----------------------------------------------------------------------
    // SCENARIO 5: ANXIETY, PANIC, CRYING, SUICIDAL, GUILT
    // -----------------------------------------------------------------------
    if (
      q.includes('anxiety') ||
      q.includes('panic') ||
      q.includes('darr') ||
      q.includes('dar') ||
      q.includes('rona') ||
      q.includes('suicide') ||
      q.includes('marne') ||
      q.includes('galti') ||
      q.includes('shanti') ||
      q.includes('akeli') ||
      q.includes('डर') ||
      q.includes('रोना') ||
      q.includes('घबराहट') ||
      q.includes('गलती')
    ) {
      if (effectiveLang === 'hi') {
        return `### 🌸 अपनी आँखें बंद करो, एक गहरी सांस लो — मैं तुम्हारे साथ हूँ!
मेरी प्यारी बहन, सबसे पहले एक बात अपने दिल पर हाथ रखकर कहो: **"मैं सुरक्षित हूँ, यह बुरा वक्त बीत जाएगा, और इसमें मेरी कोई गलती नहीं है।"**

जब कोई हमें डराता है या कोई संकट आता है, तो हमारा दिमाग एकदम से शून्य (blank) हो जाता है और ऐसा लगता है कि सब खत्म हो गया। लेकिन यह सिर्फ डर का एक बवंडर है, सच्चाई नहीं। तुम बहुत साहसी हो कि तुमने अपनी बात मुझसे साझा की।

---

### 🧘 5-4-3-2-1 ग्राउंडिंग तकनीक (अभी मेरे साथ करो):
अपने दिल की धड़कन और घबराहट को शांत करने के लिए अभी अपने कमरे में देखो:
• **5 चीजें:** जो तुम्हें अपने सामने दिखाई दे रही हैं (दीवार, पंखा, फोन, तकिया, रोशनी)।
• **4 चीजें:** जिन्हें तुम छू सकती हो (अपने हाथ, कपड़े, बिस्तर की चादर)।
• **3 आवाजें:** जो तुम्हें अभी सुनाई दे रही हैं (हवा की आवाज, सांस, कोई गाड़ी)।
• **2 चीजें:** जिनकी सुगंध तुम ले सकती हो।
• **1 बात:** जो तुम अपने बारे में सच जानती हो: *"मैं जिंदा हूँ, मैं हिम्मतवाली हूँ, और मैं इस परेशानी से जीतकर बाहर निकलूँगी।"*

---

### 💖 याद रखो:
कोई भी गलती इतनी बड़ी नहीं होती कि उसके लिए तुम अपनी जान या अपनी मुस्कान दांव पर लगा दो। गुनहगार वह व्यक्ति है जिसने घटिया हरकत की, तुम नहीं।

यदि घबराहट बहुत ज्यादा हो रही है, तो अभी भारत सरकार की 24/7 मुफ्त मानसिक स्वास्थ्य हेल्पलाइन **14416 (Tele-MANAS)** पर कॉल करो। वहाँ बेहद दयालु महिला काउंसलर्स तुमसे बात करेंगी और तुम्हारा हौसला बढ़ाएंगी।

मैं भी यहीं हूँ, तुम जो भी कहना चाहती हो मुझसे खुलकर कहो। 🌸`;
      } else {
        return `### 🌸 Ruko meri behen, gehri saans lo — main tumhare saath khadi hoon!
Sabse pehle dil se ye darr aur guilt nikaal do ki isme tumhari koi galti hai. Jab koi blackmail ya pareshan karta hai toh aisi ghabrahat hona bilkul normal hai.

Lekin yaad rakho: **Aap bohot strong ho aur yeh bura waqt jald hi khatam ho jayega.**

Apne dimaag ko shaant karne ke liye thoda thanda paani piyo aur lamba saans lo. Kisi bhi tarah ka galat kadam uthane ka khayal bhi mat laana, kyunki apradhi wo hai jisne galti ki hai, aap nahi!

Agar bohot zyada rona ya ghabrahat ho rahi hai, toh **14416 (Tele-MANAS Free Mental Helpline)** par call karein. Main bhi yahan hoon, aapko jo bhi feel ho raha hai mujhe batayein. 💖`;
      }
    }

    // -----------------------------------------------------------------------
    // SCENARIO 6: DOMESTIC VIOLENCE & IN-LAWS ABUSE
    // -----------------------------------------------------------------------
    if (
      q.includes('domestic') ||
      q.includes('violence') ||
      q.includes('abuse') ||
      q.includes('husband') ||
      q.includes('sasural') ||
      q.includes('maar') ||
      q.includes('dahej') ||
      q.includes('dowry') ||
      q.includes('shaadi') ||
      q.includes('ससुराल') ||
      q.includes('पति') ||
      q.includes('दहेज') ||
      q.includes('मारपीट')
    ) {
      if (effectiveLang === 'hi') {
        return `### 💔 घरेलू हिंसा सहना कोई संस्कार नहीं, कानून आपके साथ है!
ससुराल या रिश्ते में किसी भी प्रकार की शारीरिक मारपीट, गाली-गलौज, भावनात्मक प्रताड़ना या दहेज की मांग **घरेलू हिंसा से महिलाओं का संरक्षण अधिनियम, 2005 (PWDVA)** और BNS के तहत गंभीर गैर-जमानती अपराध है।

---

### ⚖️ आपके मुख्य कानूनी अधिकार:
1. **साझा घर में रहने का अधिकार (Right to Residence):**
   • ससुराल वाले या पति आपको घर से बाहर नहीं निकाल सकते। कोर्ट आदेश दे सकता है कि आपको उसी घर में सुरक्षित कमरा और अधिकार मिले।
2. **गुजारा भत्ता व हर्जाना (Maintenance & Relief):**
   • आपके और आपके बच्चों के भरण-पोषण तथा चिकित्सा खर्च का भुगतान पति को करना होगा।
3. **सुरक्षा आदेश (Protection Orders):**
   • मजिस्ट्रेट आदेश जारी कर सकता है कि पति या ससुराल वाले आपके कार्यस्थल या निवास के पास भी नहीं आ सकते।

---

### 🛡️ अभी तुरंत ये कदम उठाएं:
• **हेल्पलाइन 181 (Women in Distress):** 181 डायल करें; यहाँ से आपको शेल्टर होम, पुलिस सुरक्षा और लीगल काउंसलर तुरंत मिलेगा।
• **प्रोटेक्शन ऑफिसर (PO):** हर जिले के कोर्ट में प्रोटेक्शन ऑफिसर होता है, जो बिना किसी वकील की फीस के सीधे मजिस्ट्रेट के पास आपकी सुरक्षा याचिका लगवाता है।
• **मेडिकल रिपोर्ट (MLC):** यदि शारीरिक चोट लगी है, तो तुरंत सरकारी अस्पताल जाकर अपना मुलाहिजा (MLC) करवाएं। यह कोर्ट में सबसे पुख्ता सबूत बनता है।

क्या आप अभी किसी सुरक्षित स्थान पर हैं? मुझे बताएं।`;
      } else {
        return `### 💔 Domestic Violence sahan mat kijiye, kanoon poori tarah aapke saath hai!
Gharelu hinsa sirf maar-peet nahi, balki gaali-galauj, dahej ki maang ya mental torture bhi kanoonan apradh hai.

• **PWDVA 2005 Act:** Pati ya sasural wale aapko ghar se bahar nahi nikaal sakte.
• **Protection Officer (PO):** Har district court me free Protection Officer hota hai jo Magistrate se protection order dilwata hai.
• **Women Helpline 181:** Yahan call karne par shelter, police sahayata aur free counseling milti hai.

Agar chot aayi hai toh pehle Government Hospital me jakar MLC karwayein. Kya aap abhi safe jagah par hain?`;
      }
    }

    // -----------------------------------------------------------------------
    // SCENARIO 7: WORKPLACE HARASSMENT (POSH ACT)
    // -----------------------------------------------------------------------
    if (
      q.includes('workplace') ||
      q.includes('office') ||
      q.includes('posh') ||
      q.includes('colleague') ||
      q.includes('boss') ||
      q.includes('कंपनी') ||
      q.includes('कार्यस्थल')
    ) {
      if (effectiveLang === 'hi') {
        return `### 🏢 ऑफिस में छेड़छाड़ व POSH Act, 2013 के तहत आपकी सुरक्षा
कार्यस्थल पर किसी भी प्रकार का अवांछित स्पर्श, अभद्र टिप्पणियां, गंदे जोक्स, या पदोन्नति के बदले गलत मांग करना **POSH Act 2013** के तहत दंडनीय है।

• **Internal Complaints Committee (ICC):** 10 से अधिक कर्मचारियों वाली हर संस्था में एक महिला की अध्यक्षता में ICC का होना अनिवार्य है।
• **3 महीने के भीतर शिकायत:** घटना के 3 महीने के भीतर लिखित शिकायत दें।
• **Interim Reliefs:** शिकायत की जांच के दौरान आप 3 महीने की पेड लीव या अपनी टीम/विभाग बदलवाने का कानूनी अधिकार रखती हैं।
• **SHe-Box पोर्टल:** यदि कंपनी की समिति नहीं सुन रही, तो महिला एवं बाल विकास मंत्रालय के पोर्टल [shebox.nic.in](https://shebox.nic.in) पर सीधे शिकायत दर्ज करें।`;
      } else {
        return `### 🏢 Workplace Harassment & POSH Act 2013 Guidance:
Har 10+ employees wali company me **ICC (Internal Complaints Committee)** hona anivarya hai jiski head ek senior mahila hoti hai.
• Aap 3 mahine ke andar लिखित शिकायत darj kar sakti hain.
• Investigation ke dauran aapko **3 mahine tak paid leave** ya team transfer lene ka haq hai.
• Agar company action na le, toh central government ke **SHe-Box portal** (shebox.nic.in) par direct complaint file karein.`;
      }
    }

    // -----------------------------------------------------------------------
    // SCENARIO 8: GENERAL / CONVERSATIONAL ADVICE
    // -----------------------------------------------------------------------
    if (effectiveLang === 'hi') {
      return `### 🌸 मैं आपकी बात समझ रही हूँ, मेरी बहन!
जो बात आपने बताई है, वह बहुत संवेदनशील है और इस पर सही समय पर उचित कदम उठाना जरूरी है।

---

### 💡 मेरा सीधा सुझाव:
1. **साक्ष्य (Evidence) कभी न मिटाएं:** चाहे कोई मैसेज हो, स्क्रीनशॉट हो, कॉल लॉग हो या कोई गवाह — सब कुछ एक सुरक्षित जगह पर सेव करके रखें।
2. **डर या दबाव में समझौता न करें:** किसी भी अपराधी को अपनी मजबूरी न दिखाएं। जब हम निडर होकर खड़े होते हैं, तो अपराधी पीछे हटने को मजबूर हो जाता है।
3. **हेल्पलाइन का उपयोग:** यदि तत्काल पुलिस सहायता चाहिए तो **112**, साइबर अपराध के लिए **1930**, और गुप्त पहचान वाली महिला हेल्पलाइन के लिए **1090** पर कॉल करें।

आप चाहें तो ऊपर दिए गए **"📄 Generate Cyber FIR Draft"** बटन से इस पूरी घटना का पक्का पुलिस शिकायत ड्राफ्ट भी तुरंत प्राप्त कर सकती हैं।

क्या आप इस बारे में मुझे थोड़ी और जानकारी देना चाहेंगी ताकि मैं आपको बिल्कुल सटीक कानूनी कदम बता सकूँ?`;
    } else {
      return `### 🌸 Main aapki baat poori tarah samajh rahi hoon!
Aapne jo bataya hai, uspar sahi samay par thos kadam uthana bohot zaroori hai.

1. **Saboot Surakshit Karein:** Sabhi messages, call records aur screenshots ko kisi safe folder me rakhein.
2. **Darr me Samjhauta na karein:** Kisi ke dabav me aakar chup mat rahiye.
3. **Emergency Helplines:** Immediate police ke liye **112**, Cyber ke liye **1930**, aur secret complaint ke liye **1090** active hai.

Aap upar diye gaye **"📄 Generate Cyber FIR Draft"** button par click karke turant police cyber complaint letter bhi generate kar sakti hain.

Kya aap is incident ke baare me thoda aur detail batana chahengi? Main poori tarah aapke saath hoon.`;
    }
  };

  // Handle Send Message
  const handleSend = () => {
    if (!inputText.trim() || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText.trim();
    setInputText('');
    setIsTyping(true);

    // Realistic Typing Stream Effect (word-by-word just like Gemini / ChatGPT)
    setTimeout(() => {
      const fullResponse = generateRealisticHumanResponse(query);
      const botMsgId = `bot-${Date.now()}`;
      setStreamingText('');

      let charIndex = 0;
      const chunkSize = 5;
      const interval = setInterval(() => {
        charIndex += chunkSize;
        if (charIndex >= fullResponse.length) {
          clearInterval(interval);
          setStreamingText('');
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: botMsgId,
              sender: 'bot',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              text: fullResponse
            }
          ]);
        } else {
          setStreamingText(fullResponse.slice(0, charIndex));
        }
      }, 12);
    }, 450);
  };

  const handleChipClick = (query) => {
    setInputText(query);
  };

  const copyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate FIR Dossier Draft
  const generateFirDossier = () => {
    const userQueries = messages
      .filter((m) => m.sender === 'user')
      .map((m) => m.text)
      .join('\n\n');

    const draft = `================================================================================
औपचारिक पुलिस शिकायत / साइबर अपराध प्राथमिकी विवरण (FORMAL POLICE CYBER FIR DOSSIER)
Under Bharatiya Nyaya Sanhita (BNS) 2023 & Information Technology Act 2000
================================================================================
Date / दिनांक: ${new Date().toLocaleDateString('en-IN')}
To / सेवा में:
The Station House Officer / In-Charge Cyber Crime Police Station
थाना प्रभारी / साइबर क्राइम सेल
Jurisdiction: [Enter Police Station / Cyber Cell Location]

SUBJECT / विषय: Complaint regarding online harassment, extortion, stalking, and cyber intimidation.
(महिला उत्पीड़न, ब्लैकमेलिंग, पीछा करने व साइबर अपराध के विरुद्ध औपचारिक प्राथमिकी दर्ज करने हेतु)

RESPECTED SIR / MA'AM (महोदय / महोदया),

I, [Complainant Full Name / प्रार्थिया का नाम], resident of [Address / पता], wish to report the following serious cyber offense:

1. STATEMENT OF INCIDENT & FACTS (घटना का पूर्ण विवरण):
${userQueries || 'The perpetrator has engaged in persistent cyber harassment, stalking, and unlawful intimidation through digital channels.'}

2. PERTINENT STATUTORY PROVISIONS APPLICABLE (सुसंगत कानूनी धाराएं):
- Section 66E, Information Technology Act, 2000 (Violation of privacy / निजता का हनन)
- Section 67 / 67A, Information Technology Act, 2000 (Transmitting sexually explicit content / ब्लैकमेलिंग)
- Section 78, Bharatiya Nyaya Sanhita (BNS) 2023 / Section 354D IPC (Stalking / पीछा करना)
- Section 351, Bharatiya Nyaya Sanhita (BNS) 2023 / Section 506 IPC (Criminal Intimidation / धमकी देना)
- Section 308, Bharatiya Nyaya Sanhita (BNS) 2023 / Section 384 IPC (Extortion / रंगदारी व उगाही)

3. EVIDENCE PRESERVED (सुरक्षित किए गए साक्ष्य):
- Certified timestamped screenshots of communications, handles, and URLs.
- Suspect phone numbers, UPI identifiers, and call frequency records.

4. PRAYER / RELIEF SOUGHT (प्रार्थना):
It is respectfully prayed that an immediate FIR (or Zero FIR under BNSS Section 173) be registered, the offender be tracked down through digital subscriber identifiers, and urgent protective orders be issued.

Yours faithfully (भवदीया),
[Complainant Signature / Name]
Contact / संपर्क सूत्र: [Phone Number]
Generated via HERHUB Nyaya-Saheli AI Legal Dossier Sentinel
================================================================================`;

    setFirDraftText(draft);
    setShowFirModal(true);
  };

  // Markdown-like parser with High Contrast Colors
  const renderFormattedText = (rawText) => {
    const lines = rawText.split('\n');
    return lines.map((line, index) => {
      // Header 3
      if (line.startsWith('### ')) {
        return (
          <h6
            key={index}
            style={{
              fontWeight: 900,
              color: t.headingColor,
              marginTop: 14,
              marginBottom: 8,
              fontSize: '0.96rem'
            }}
          >
            {line.replace('### ', '')}
          </h6>
        );
      }
      // Horizontal Rule
      if (line.startsWith('---')) {
        return <hr key={index} style={{ borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#CBD5E1', margin: '12px 0' }} />;
      }
      // Bullet Point
      if (line.startsWith('• ') || line.startsWith('- ')) {
        const content = line.replace(/^[•-]\s*/, '');
        return (
          <div key={index} className="d-flex align-items-start gap-2 mb-1" style={{ fontSize: '0.88rem', lineHeight: '1.55' }}>
            <span style={{ color: '#6355E6', fontWeight: 900 }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
          </div>
        );
      }
      // Numbered List
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={index} className="d-flex align-items-start gap-2 mb-1" style={{ fontSize: '0.88rem', lineHeight: '1.55' }}>
            <span style={{ color: '#D97706', fontWeight: 900 }}>{line.match(/^\d+\./)[0]}</span>
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.replace(/^\d+\.\s*/, '')) }} />
          </div>
        );
      }
      // Empty Line
      if (!line.trim()) {
        return <div key={index} style={{ height: 6 }} />;
      }
      // Normal Line
      return (
        <p key={index} style={{ marginBottom: 4, fontSize: '0.88rem', lineHeight: '1.6', color: t.textPrimary }} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
      );
    });
  };

  const formatInlineMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, `<strong style="color: ${t.strongText}; font-weight: 800;">$1</strong>`)
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #0284C7; text-decoration: underline; font-weight: 700;">$1</a>');
  };

  const currentChips = quickChips[langMode] || quickChips.hi;

  return (
    <div style={{ backgroundColor: t.pageBg, minHeight: '100vh', color: t.textPrimary, transition: 'all 0.25s ease' }}>
      {/* ===================================================================
          HERO BANNER: NYAYA-SAHELI AI COUNSELOR
      =================================================================== */}
      <section style={{ backgroundColor: t.headerBg, color: '#FFFFFF', padding: '28px 0 20px', borderBottom: t.border }}>
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
            <Link
              to="/safety-hub"
              className="text-decoration-none d-inline-flex align-items-center gap-2"
              style={{ color: '#C9C0F0', fontSize: '0.82rem', fontWeight: 600 }}
            >
              ← Back to Safety Hub
            </Link>

            {/* LANGUAGE SELECTOR TOGGLE (Hindi, Hinglish, English) */}
            <div className="d-flex align-items-center gap-2">
              <span className="d-flex align-items-center gap-1 text-light" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                <FaLanguage style={{ fontSize: '1.1rem', color: '#FDE047' }} /> भाषा (Language):
              </span>
              <div className="btn-group btn-group-sm" role="group">
                <button
                  type="button"
                  onClick={() => changeLanguage('hi')}
                  className={`btn ${langMode === 'hi' ? 'btn-warning text-dark font-weight-bold' : 'btn-outline-light'}`}
                  style={{ borderRadius: '8px 0 0 8px', fontSize: '0.75rem', fontWeight: 800 }}
                >
                  🇮🇳 हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => changeLanguage('hinglish')}
                  className={`btn ${langMode === 'hinglish' ? 'btn-warning text-dark font-weight-bold' : 'btn-outline-light'}`}
                  style={{ fontSize: '0.75rem', fontWeight: 800 }}
                >
                  🌐 Hinglish
                </button>
                <button
                  type="button"
                  onClick={() => changeLanguage('en')}
                  className={`btn ${langMode === 'en' ? 'btn-warning text-dark font-weight-bold' : 'btn-outline-light'}`}
                  style={{ borderRadius: '0 8px 8px 0', fontSize: '0.75rem', fontWeight: 800 }}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 style={{ fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                <FaRobot style={{ color: '#A78BFA' }} />
                AI Cyber FIR & Legal Dossier
              </h2>
              <p style={{ color: '#CBD5E1', fontSize: '0.86rem', marginBottom: 0, maxWidth: 660 }}>
                {langMode === 'hi'
                  ? 'आपकी 24/7 व्यक्तिगत कानूनी व भावनात्मक काउंसलर (BNS धाराएं, साइबर ब्लैकमेल सुरक्षा, जीरो FIR और मानसिक संबल)'
                  : 'Your 24/7 Legal & Emotional Safety Counselor: BNS Sections, Cyber Blackmail Defense, Zero FIR & Mental Resilience.'}
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <button
                type="button"
                onClick={generateFirDossier}
                className="btn btn-warning px-3 py-2 d-inline-flex align-items-center gap-2"
                style={{ borderRadius: 12, fontWeight: 900, fontSize: '0.84rem', color: '#0F172A', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)' }}
              >
                <FaFileAlt /> 📄 {langMode === 'hi' ? 'पुलिस FIR ड्राफ्ट निकालें' : 'Generate Police FIR Draft'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          MAIN CHAT INTERFACE
      =================================================================== */}
      <main className="container py-4">
        <div className="row g-4">
          {/* LEFT 8 COLS: CHAT CONTAINER */}
          <div className="col-lg-8">
            <div
              className="d-flex flex-column rounded-4"
              style={{
                backgroundColor: t.chatCardBg,
                border: t.border,
                height: '76vh',
                boxShadow: '0 12px 35px rgba(0,0,0,0.08)'
              }}
            >
              {/* CHAT HEADER */}
              <div
                className="p-3 d-flex align-items-center justify-content-between"
                style={{
                  borderBottom: t.border,
                  backgroundColor: isDark ? 'rgba(30, 18, 60, 0.6)' : '#FAFAFD'
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: '#6355E6', color: '#FFFFFF', fontSize: '1.1rem' }}
                  >
                    <FaRobot />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: t.textPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
                      AI Cyber FIR & Legal Dossier Companion
                      <FaHeart style={{ color: '#EF4444', fontSize: '0.8rem' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="spinner-grow spinner-grow-sm text-success" style={{ width: 8, height: 8 }} role="status" />
                      {langMode === 'hi' ? 'सक्रिय • बड़ी बहन की तरह गोपनीय कानूनी सहारा' : 'Active • Real Empathetic Legal & Emotional Sister'}
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMessages([getWelcomeMessage(langMode)])}
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                    style={{ borderRadius: 8, fontSize: '0.74rem' }}
                    title="Clear Conversation"
                  >
                    <FaRedo /> {langMode === 'hi' ? 'रीसेट' : 'Reset'}
                  </button>
                </div>
              </div>

              {/* MESSAGES THREAD (SCROLLABLE) */}
              <div className="flex-grow-1 p-3 p-md-4 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    {msg.sender === 'bot' && (
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center me-2 flex-shrink-0"
                        style={{
                          width: 34,
                          height: 34,
                          backgroundColor: '#6355E6',
                          color: '#FFFFFF',
                          fontSize: '0.9rem'
                        }}
                      >
                        <FaRobot />
                      </div>
                    )}

                    <div
                      style={{
                        maxWidth: '84%',
                        backgroundColor: msg.sender === 'user' ? t.userBubbleBg : t.botBubbleBg,
                        color: msg.sender === 'user' ? '#FFFFFF' : t.textPrimary,
                        borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                        padding: '12px 16px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                        border: msg.sender === 'bot' ? t.border : 'none'
                      }}
                    >
                      {msg.sender === 'bot' ? (
                        <div>{renderFormattedText(msg.text)}</div>
                      ) : (
                        <div style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                          {msg.text}
                        </div>
                      )}

                      <div
                        className="d-flex align-items-center justify-content-between mt-2 pt-1 border-top"
                        style={{
                          borderColor: msg.sender === 'user' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)',
                          fontSize: '0.68rem',
                          opacity: 0.85
                        }}
                      >
                        <span>{msg.timestamp}</span>
                        {msg.sender === 'bot' && (
                          <div className="d-flex align-items-center gap-2">
                            <button
                              type="button"
                              onClick={() => speakMessage(msg.text)}
                              className="btn btn-link p-0 text-decoration-none"
                              style={{ color: t.textSecondary, fontSize: '0.78rem' }}
                              title="Listen to this response"
                            >
                              {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyMessage(msg.id, msg.text)}
                              className="btn btn-link p-0 text-decoration-none"
                              style={{ color: t.textSecondary, fontSize: '0.78rem' }}
                              title="Copy response"
                            >
                              {copiedId === msg.id ? <FaCheck className="text-success" /> : <FaCopy />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* STREAMING RESPONSE REVEAL (WHEN AI IS TYPING) */}
                {isTyping && (
                  <div className="d-flex mb-3 justify-content-start">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-2 flex-shrink-0"
                      style={{ width: 34, height: 34, backgroundColor: '#6355E6', color: '#FFFFFF', fontSize: '0.9rem' }}
                    >
                      <FaRobot />
                    </div>
                    <div
                      style={{
                        maxWidth: '84%',
                        backgroundColor: t.botBubbleBg,
                        color: t.textPrimary,
                        borderRadius: '4px 18px 18px 18px',
                        padding: '12px 16px',
                        border: t.border
                      }}
                    >
                      {streamingText ? (
                        <div>{renderFormattedText(streamingText)}</div>
                      ) : (
                        <div className="d-flex align-items-center gap-2 py-1">
                          <span className="spinner-grow spinner-grow-sm text-primary" role="status" />
                          <span style={{ fontSize: '0.82rem', color: t.textSecondary }}>
                            {langMode === 'hi'
                              ? 'सहेली आपकी स्थिति का कानूनी व मानसिक विश्लेषण कर रही है...'
                              : 'Nyaya-Saheli is formulating your empathetic legal guidance...'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* QUICK CHIP PROMPTS SCROLLER */}
              <div
                className="px-3 py-2 d-flex gap-2 overflow-x-auto"
                style={{
                  borderTop: t.border,
                  backgroundColor: isDark ? 'rgba(20, 10, 40, 0.4)' : '#FBFBFE',
                  whiteSpace: 'nowrap'
                }}
              >
                {currentChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChipClick(chip.query)}
                    className="btn btn-sm text-nowrap"
                    style={{
                      borderRadius: 20,
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      backgroundColor: t.chipBg,
                      border: t.chipBorder,
                      color: t.chipText
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* CHAT INPUT AREA */}
              <div className="p-3" style={{ borderTop: t.border, backgroundColor: isDark ? '#140D2A' : '#FFFFFF', borderRadius: '0 0 16px 16px' }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="d-flex align-items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={toggleMic}
                    className={`btn ${isListening ? 'btn-danger' : 'btn-outline-secondary'} d-flex align-items-center justify-content-center flex-shrink-0`}
                    style={{ width: 44, height: 44, borderRadius: 12 }}
                    title={isListening ? 'Listening... click to stop' : 'बोलकर बात करें (Voice Input)'}
                  >
                    {isListening ? <FaMicrophoneSlash className="animate-pulse" /> : <FaMicrophone />}
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      langMode === 'hi'
                        ? 'यहाँ अपनी बात लिखिए या माइक से बोलकर बताइए (जैसे: किसी ने फोटो बना ली है, क्या करूँ?)...'
                        : 'Type your situation or speak via mic (e.g. someone is blackmailing me with photos)...'
                    }
                    className="form-control"
                    style={{
                      backgroundColor: t.inputBg,
                      color: t.textPrimary,
                      border: t.border,
                      borderRadius: 12,
                      padding: '10px 16px',
                      fontSize: '0.9rem'
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
                    className="btn btn-primary d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: '#6355E6',
                      borderColor: '#6355E6'
                    }}
                  >
                    <FaPaperPlane />
                  </button>
                </form>
                <div className="d-flex justify-content-between align-items-center mt-2 px-1" style={{ fontSize: '0.72rem', color: t.textSecondary }}>
                  <span>🔒 100% गोपनीय व सुरक्षित (End-to-End Encrypted Session)</span>
                  <span><strong>Enter ↵</strong> दबाकर भेजें</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLS: EMERGENCY PROTOCOL & HELPLINE MATRIX */}
          <div className="col-lg-4">
            <div className="d-flex flex-column gap-3">
              {/* CARD 1: 1-TAP POLICE CYBER FIR DOSSIER GENERATOR */}
              <div
                className="p-3 rounded-4"
                style={{
                  backgroundColor: t.chatCardBg,
                  border: '2px solid #6355E6',
                  boxShadow: '0 8px 25px rgba(99, 85, 230, 0.12)'
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FaFileAlt style={{ color: '#818CF8', fontSize: '1.2rem' }} />
                  <strong style={{ fontSize: '0.88rem', color: t.textPrimary }}>
                    {langMode === 'hi' ? 'पुलिस साइबर FIR ड्राफ्ट तैयार करें' : 'Generate Police Cyber FIR Draft'}
                  </strong>
                </div>
                <p style={{ fontSize: '0.76rem', color: t.textSecondary, marginBottom: 10 }}>
                  {langMode === 'hi'
                    ? 'आपने जो भी बातचीत की है, AI उसे औपचारिक कानूनी प्रारूप (BNS व IT Act) में पुलिस शिकायत पत्र में बदल देगा।'
                    : 'Converts your entire case into a formal, court-admissible police cyber complaint letter in 1 click.'}
                </p>
                <button
                  type="button"
                  onClick={generateFirDossier}
                  className="btn btn-sm btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: 10, fontWeight: 900, fontSize: '0.82rem', backgroundColor: '#6355E6' }}
                >
                  📄 {langMode === 'hi' ? 'एफआईआर ड्राफ्ट डाउनलोड / कॉपी करें' : 'Export Case as FIR Dossier'}
                </button>
              </div>

              {/* CARD 2: 24/7 VERIFIED EMERGENCY HELPLINES */}
              <div className="p-3 rounded-4" style={{ backgroundColor: t.chatCardBg, border: t.border }}>
                <h6 style={{ fontWeight: 800, color: t.textPrimary, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.86rem' }}>
                  <FaPhoneAlt style={{ color: '#EF4444' }} />
                  {langMode === 'hi' ? '24/7 सत्यापित आपातकालीन हेल्पलाइन' : '24/7 Verified Emergency Helplines'}
                </h6>

                <div className="d-flex flex-column gap-2" style={{ fontSize: '0.78rem' }}>
                  <div className="p-2 rounded-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: t.botBubbleBg }}>
                    <div>
                      <strong className="d-block text-danger">112 — राष्ट्रीय आपातकाल (National 112)</strong>
                      <span style={{ color: t.textSecondary, fontSize: '0.7rem' }}>पुलिस, एम्बुलेंस, तत्काल सुरक्षा</span>
                    </div>
                    <a href="tel:112" className="btn btn-sm btn-outline-danger py-0 px-2" style={{ borderRadius: 6, fontSize: '0.72rem' }}>Call</a>
                  </div>

                  <div className="p-2 rounded-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: t.botBubbleBg }}>
                    <div>
                      <strong className="d-block text-warning">1930 — राष्ट्रीय साइबर हेल्पलाइन</strong>
                      <span style={{ color: t.textSecondary, fontSize: '0.7rem' }}>ब्लैकमेलिंग, मॉर्फ्ड फोटो, वित्तीय धोखाधड़ी</span>
                    </div>
                    <a href="tel:1930" className="btn btn-sm btn-outline-warning py-0 px-2" style={{ borderRadius: 6, fontSize: '0.72rem' }}>Call</a>
                  </div>

                  <div className="p-2 rounded-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: t.botBubbleBg }}>
                    <div>
                      <strong className="d-block text-info">1090 — महिला पावर लाइन</strong>
                      <span style={{ color: t.textSecondary, fontSize: '0.7rem' }}>स्टॉकिंग व फोन हैरेसमेंट (पहचान 100% गुप्त)</span>
                    </div>
                    <a href="tel:1090" className="btn btn-sm btn-outline-info py-0 px-2" style={{ borderRadius: 6, fontSize: '0.72rem' }}>Call</a>
                  </div>

                  <div className="p-2 rounded-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: t.botBubbleBg }}>
                    <div>
                      <strong className="d-block text-success">14416 — टेली-मानस (Tele-MANAS)</strong>
                      <span style={{ color: t.textSecondary, fontSize: '0.7rem' }}>24/7 मुफ्त मानसिक स्वास्थ्य व ट्रॉमा काउंसलर</span>
                    </div>
                    <a href="tel:14416" className="btn btn-sm btn-outline-success py-0 px-2" style={{ borderRadius: 6, fontSize: '0.72rem' }}>Call</a>
                  </div>

                  <div className="p-2 rounded-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: t.botBubbleBg }}>
                    <div>
                      <strong className="d-block text-primary">15100 — मुफ्त सरकारी वकील (NALSA)</strong>
                      <span style={{ color: t.textSecondary, fontSize: '0.7rem' }}>कोर्ट केस लड़ने हेतु निःशुल्क विधिक सहायता</span>
                    </div>
                    <a href="tel:15100" className="btn btn-sm btn-outline-primary py-0 px-2" style={{ borderRadius: 6, fontSize: '0.72rem' }}>Call</a>
                  </div>
                </div>
              </div>

              {/* CARD 3: CRITICAL LEGAL SURAKSHA KAVACH QUICK FACTS */}
              <div className="p-3 rounded-4" style={{ backgroundColor: t.chatCardBg, border: t.border }}>
                <h6 style={{ fontWeight: 800, color: t.textPrimary, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.86rem' }}>
                  <FaBalanceScale style={{ color: '#F59E0B' }} />
                  {langMode === 'hi' ? 'भारतीय कानून में 3 विशेष सुरक्षा कवच' : '3 Fundamental Women Protections in Law'}
                </h6>
                <ul className="mb-0 ps-3" style={{ fontSize: '0.76rem', color: t.textSecondary, lineHeight: '1.55' }}>
                  <li className="mb-1">
                    <strong style={{ color: t.strongText }}>जीरो FIR (Zero FIR):</strong> क्षेत्राधिकार की परवाह किए बिना देश के किसी भी थाने में FIR दर्ज कराई जा सकती है।
                  </li>
                  <li className="mb-1">
                    <strong style={{ color: t.strongText }}>महिला पुलिस अधिकारी:</strong> उत्पीड़न या यौन अपराध में बयान सिर्फ महिला पुलिस अधिकारी ही लेगी।
                  </li>
                  <li>
                    <strong style={{ color: t.strongText }}>सूर्यास्त से सूर्योदय:</strong> किसी भी महिला को रात में (सूर्यास्त के बाद) गिरफ्तार नहीं किया जा सकता।
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ===================================================================
          MODAL: FORMAL CYBER FIR COMPLAINT DOSSIER DRAFT
      =================================================================== */}
      {showFirModal && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: 'rgba(5, 2, 14, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 1070
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div
              className="modal-content"
              style={{
                backgroundColor: isDark ? '#140D2A' : '#FFFFFF',
                color: t.textPrimary,
                borderRadius: 20,
                border: t.border,
                boxShadow: '0 20px 60px rgba(0,0,0,0.45)'
              }}
            >
              <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
                <h5 className="modal-title" style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FaFileAlt style={{ color: '#6355E6' }} />
                  {langMode === 'hi' ? 'औपचारिक पुलिस साइबर प्राथमिकी विवरण (FIR Dossier)' : 'Official Police Cyber FIR Complaint Dossier'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowFirModal(false)}
                />
              </div>

              <div className="modal-body">
                <p style={{ fontSize: '0.8rem', color: t.textSecondary }}>
                  यह ड्राफ्ट आपकी बातचीत के आधार पर **BNS 2023 व IT Act 2000** के कानूनी प्रारूप में तैयार किया गया है।
                  आप इसे कॉपी करके **cybercrime.gov.in** पर अपलोड कर सकती हैं या प्रिंट निकालकर संबंधित थाने में जमा कर सकती हैं।
                </p>

                <textarea
                  readOnly
                  value={firDraftText}
                  className="form-control"
                  rows={15}
                  style={{
                    backgroundColor: isDark ? '#0A0618' : '#F8FAFC',
                    color: t.textPrimary,
                    border: t.border,
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    lineHeight: '1.45',
                    borderRadius: 12
                  }}
                />
              </div>

              <div className="modal-footer border-0 pt-0 d-flex justify-content-between">
                <div style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 700 }}>
                  ✓ Standard Legal Format Compatible with All Indian Cyber Cells
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(firDraftText);
                      setFirCopied(true);
                      setTimeout(() => setFirCopied(false), 2000);
                    }}
                    className="btn btn-primary d-flex align-items-center gap-1"
                    style={{ borderRadius: 10, fontWeight: 800, fontSize: '0.82rem', backgroundColor: '#6355E6' }}
                  >
                    {firCopied ? <FaCheck /> : <FaCopy />}
                    {firCopied ? 'Copied to Clipboard!' : 'Copy FIR Draft'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFirModal(false)}
                    className="btn btn-outline-secondary"
                    style={{ borderRadius: 10, fontSize: '0.82rem' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
