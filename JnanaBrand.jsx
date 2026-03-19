import { useState, useEffect, useRef, createContext, useContext, useMemo } from "react"
import * as THREE from "three"

// ── Lang ─────────────────────────────────────────────────────────────────
const LangCtx = createContext({ lang:"en", setLang:()=>{} })
const useLang = () => useContext(LangCtx)

const T = {
  // Nav
  nav_brand:  {en:"JÑĀNA",          ta:"ஞானம்",          sa:"ज्ञानम्"},
  nav_why:    {en:"Why We Gather",   ta:"ஏன் கூடுகிறோம்",  sa:"किमर्थं मिलामः"},
  nav_chariot:{en:"The Chariot",     ta:"ரதம்",            sa:"रथः"},
  nav_yogas:  {en:"Three Yogas",     ta:"மூன்று யோகம்",    sa:"त्रयो योगाः"},
  nav_sangha: {en:"The Sangha",      ta:"சங்கம்",          sa:"सङ्घः"},
  nav_join:   {en:"Join",            ta:"இணைவாய்",         sa:"सम्मिलस्व"},

  // Hero
  hero_lbl:   {en:"A Free, Open Community",  ta:"ஒரு இலவச, திறந்த சமூகம்",  sa:"मुक्तः, खुलः समुदायः"},
  hero_eye:   {en:"Where Ancient Wisdom Meets the Digital Age", ta:"பண்டைய ஞானம் டிஜிட்டல் யுகத்தை சந்திக்கும் இடம்", sa:"यत्र पुरातनज्ञानम् आधुनिकयुगेन मिलति"},
  hero_tag:   {en:"We are seekers, developers, meditators and makers gathering around one question — can the wisdom of the Gita and Upanishads help us live, build and create more consciously in the digital age?", ta:"நாம் தேடுபவர்கள், நிரலாளர்கள், தியானிகள் மற்றும் உருவாக்குநர்கள் — ஒரே கேள்வியை சுற்றி கூடுகிறோம்: கீதையும் உபநிஷத்களும் டிஜிட்டல் யுகத்தில் நாம் இன்னும் விழிப்புடன் வாழவும் கட்டவும் உதவுமா?", sa:"वयं साधकाः, विकासकाः, ध्यानिनः, निर्मातारः च — एकस्यां प्रश्नस्य परितः मिलामः।"},
  btn_join:   {en:"Join the Satsang",   ta:"சத்சங்கத்தில் சேர்",   sa:"सत्सङ्गे सम्मिलस्व"},
  btn_read:   {en:"Explore the Field",  ta:"களத்தை ஆராய்",         sa:"क्षेत्रं अन्वेष"},

  // Why We Gather
  why_pre:    {en:"The Crisis of Our Age",  ta:"நமது யுகத்தின் நெருக்கடி",  sa:"अस्माकं युगस्य संकटम्"},
  why_title:  {en:"Why This Community Exists", ta:"இந்த சமூகம் ஏன் உள்ளது", sa:"अयं समुदायः किमर्थम् अस्ति"},
  why_p1:     {en:"We have built the most powerful information technology in history. We can process petabytes, train vast intelligences, and connect billions. And yet the people building these systems report record levels of anxiety, meaninglessness and disconnection.", ta:"நாம் வரலாற்றில் மிக சக்திவாய்ந்த தகவல் தொழில்நுட்பத்தை கட்டியிருக்கிறோம். ஆயினும் இந்த அமைப்புகளை கட்டும் மக்கள் கவலை, அர்த்தமின்மை மற்றும் பிரிவினையில் சாதனை அளவுகளை அனுபவிக்கிறார்கள்.", sa:"वयम् इतिहासस्य सर्वाधिकशक्तिशाली सूचनातन्त्रज्ञानम् निर्मितवन्तः। तथापि एतेषां निर्मातॄणां चित्ते अभूतपूर्वा आकुलता, निरर्थकता, वियोगश्च वर्तते।"},
  why_v1_sk:  {en:"Nainam chindanti shastrani nainam dahati pavakah", ta:"நைனம் சிந்தந்தி சஸ்த்ராணி நைனம் தஹதி பாவகஃ", sa:"नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः।"},
  why_v1_tr:  {en:"\"Weapons do not cleave this self, fire does not burn it, waters do not wet it, wind does not dry it.\"", ta:"\"ஆயுதங்கள் இந்த ஆன்மாவை வெட்ட முடியாது, தீ எரிக்க முடியாது, நீர் நனைக்க முடியாது, காற்று காய வைக்க முடியாது.\"", sa:"\"अस्य आत्मनः शस्त्राणि छेदनं न कुर्वन्ति, वह्निः दाहनं न करोति।\""},
  why_v1_src: {en:"— Bhagavad Gita, 2.23", ta:"— பகவத் கீதை, 2.23", sa:"— भगवद्गीता, २.२३"},
  why_p2:     {en:"The Bhagavad Gita was delivered on a battlefield to someone having a panic attack. The Upanishads were transmitted in quiet forests to those who had left the marketplace behind. Both carry the same message: the crisis is always interior. The answer was always interior. This community exists to explore that interior together.", ta:"பகவத் கீதை பீதியடைந்த ஒருவருக்கு போர்க்களத்தில் வழங்கப்பட்டது. உபநிஷத்கள் சந்தையை விட்டுவிட்டவர்களுக்கு அமைதியான காடுகளில் அனுப்பப்பட்டன. இரண்டும் ஒரே செய்தியை சுமக்கின்றன: நெருக்கடி எப்போதும் உள்ளிருக்கிறது. பதில் எப்போதும் உள்ளிருக்கிறது. இந்த சமூகம் அந்த உள்ளத்தை ஒன்றாக ஆராய உள்ளது.", sa:"गीता रणभूमौ कस्मैचित् भयग्रस्ताय दत्ता। उपनिषदः विपणिं त्यक्तेभ्यः वनेषु प्रेषिताः। उभे अपि एकमेव वदतः — संकटम् सदा अन्तरे। समाधानम् अपि सदा अन्तरे।"},
  why_v2_sk:  {en:"Sarvam khalvidam brahma", ta:"ஸர்வம் கல்விதம் பிரஹ்ம", sa:"सर्वं खल्विदं ब्रह्म।"},
  why_v2_tr:  {en:"\"All this is indeed Brahman.\" The entire universe — including every server, every algorithm, every screen you have ever looked into — is that one undivided consciousness exploring itself.", ta:"\"இவை அனைத்தும் நிச்சயமாக பிரஹ்மம்.\" ஒவ்வொரு சேவையகம், ஒவ்வொரு அல்காரிதம், நீங்கள் ஒருபோதும் பார்த்த ஒவ்வொரு திரையும் உட்பட முழு பிரபஞ்சமும் — அந்த ஒரு பிரிக்கப்படாத உணர்வு தன்னை ஆராய்கிறது.", sa:"\"इदं सर्वं निश्चितं ब्रह्मैव।\" प्रत्येकं सर्वरः, प्रत्येकम् अल्गोरिदम, प्रत्येका दर्शिका — सर्वम् एकमेव अविभक्तं चेतनं स्वमेव अन्वेषयति।"},
  why_v2_src: {en:"— Chandogya Upanishad, 3.14.1", ta:"— சாந்தோக்ய உபநிஷத், 3.14.1", sa:"— छान्दोग्योपनिषत्, ३.१४.१"},

  // Chariot
  rath_pre:   {en:"Katha Upanishad · 1.3.3",  ta:"கட உபநிஷத் · 1.3.3",   sa:"कठोपनिषत् · १.३.३"},
  rath_title: {en:"The Chariot of Awareness",  ta:"விழிப்புணர்வின் தேர்",  sa:"चेतनायाः रथः"},
  rath_intro: {en:"\"Know the Self as the master of the chariot, the body as the chariot, the intellect as the charioteer, and the mind as the reins. The senses are the horses; the objects of the senses are their paths.\"", ta:"\"ஆன்மாவை தேரின் அதிபதியாக, உடலை தேராக, புத்தியை சாரதியாக, மனதை கடிவாளமாக அறிவாயாக. புலன்களே குதிரைகள்; புலன் விஷயங்களே அவற்றின் பாதைகள்.\"", sa:"\"आत्मानं रथिनं विद्धि शरीरं रथमेव च। बुद्धिं तु सारथिं विद्धि मनः प्रग्रहमेव च। इन्द्रियाणि हयानाहुर्विषयांस्तेषु गोचरान्।\""},
  rath_context:{en:"This 2,500-year-old map from the Katha Upanishad is perhaps the most complete model of human consciousness ever written. What makes it remarkable is how perfectly it describes the challenge of living in a world of notifications, algorithms and infinite scroll.", ta:"கட உபநிஷத்திலிருந்து இந்த 2,500 ஆண்டு பழமையான வரைபடம் எழுதப்பட்ட மனித உணர்வின் மிக முழுமையான மாதிரியாக இருக்கலாம். அறிவிப்புகள், அல்காரிதம்கள் மற்றும் எல்லையற்ற ஸ்க்ரோல் உலகில் வாழும் சவாலை இது எவ்வளவு சரியாக விவரிக்கிறது என்பதே இதை குறிப்பிடத்தக்கதாக்குகிறது.", sa:"कठोपनिषत्स्थः अयं २५०० वर्षपुरातनः मानचित्रः मानवचेतनस्य सर्वाधिकपूर्णः प्रतिरूपः अस्ति। सूचना-अल्गोरिदम-जगति जीवनस्य चुनौतिं सः अत्यन्तं सटीकतया वर्णयति।"},
  rl_atman:    {en:"Ātman",       ta:"ஆத்மன்",       sa:"आत्मन्"},
  rl_atman_e:  {en:"The pure, unmoving witness. Not the role, not the identity, not the portfolio. That which watches without becoming.", ta:"தூய, அசைவற்ற சாட்சி. பாத்திரம் அல்ல, அடையாளம் அல்ல, ஆவணக்கோப்பு அல்ல. ஆவாமல் கவனிப்பது.", sa:"शुद्धः, अचलः साक्षी। भूमिका नहि, परिचयः नहि। यः पश्यति, यः भवति न।"},
  rl_buddhi:   {en:"Buddhi",      ta:"புத்தி",       sa:"बुद्धिः"},
  rl_buddhi_e: {en:"Discerning intelligence. The capacity to distinguish the real from the apparently real — signal from noise, dharma from distraction.", ta:"விவேக நுண்ணறிவு. உண்மையையும் தோற்றமான உண்மையையும் — சமிக்ஞையையும் சத்தத்தையும், தர்மத்தையும் சிதறலையும் பிரிக்கும் திறன்.", sa:"विवेकबुद्धिः। सत्यम् आभासिकसत्याच्च — संकेतं कोलाहलाच्च विवेचयितुं शक्तिः।"},
  rl_manas:    {en:"Manas",       ta:"மனம்",         sa:"मनः"},
  rl_manas_e:  {en:"The reactive mind — processing sensory inputs, generating likes and dislikes, caught in the loops of memory and anticipation. The source of most of our suffering.", ta:"வினைகாரி மனம் — புலன் உள்ளீடுகளை செயலாக்குவது, விருப்பு வெறுப்புகளை உருவாக்குவது, நினைவு மற்றும் எதிர்பார்ப்பின் சுழல்களில் சிக்கியது.", sa:"प्रतिक्रियाशीलं मनः — इन्द्रियसूचनाः प्रक्रियते, रागद्वेषौ जनयति, स्मृत्यपेक्षयोः चक्रेषु बद्धम्।"},
  rl_indriya:  {en:"Indriyas",    ta:"இந்திரியங்கள்", sa:"इन्द्रियाणि"},
  rl_indriya_e:{en:"The five senses + the five organs of action. The horses pulling the chariot — powerful, necessary, but needing a skilled driver. In the digital age: notifications, feeds, inputs, outputs.", ta:"ஐந்து புலன்கள் + ஐந்து செயல் உறுப்புகள். தேரை இழுக்கும் குதிரைகள் — சக்திவாய்ந்தவை, அவசியமானவை, ஆனால் திறமையான சாரதி தேவை.", sa:"पञ्चज्ञानेन्द्रियाणि + पञ्चकर्मेन्द्रियाणि। रथं वहन्तः अश्वाः — शक्तिमन्तः, आवश्यकाः, परन्तु कुशलसारथिम् अपेक्षन्ते।"},
  rl_shareera: {en:"Shareera",    ta:"சரீரம்",       sa:"शरीरम्"},
  rl_shareera_e:{en:"The body — the vehicle itself. Without it, none of the journey is possible. In the digital context: the device, the network, the physical infrastructure of our digital lives.", ta:"உடல் — வாகனம் தானே. அது இல்லாமல், பயணம் சாத்தியமில்லை. டிஜிட்டல் சூழலில்: கருவி, நெட்வொர்க், நமது டிஜிட்டல் வாழ்க்கையின் இயற்பியல் உள்கட்டமைப்பு.", sa:"शरीरम् — स्वयं वाहनम्। तत् विना यात्रा न सम्भवति। जालीयसन्दर्भे: यन्त्रम्, जालः, आधारसंरचना।"},

  // Three Yogas
  yoga_pre:   {en:"The Gita's Three Paths",     ta:"கீதையின் மூன்று வழிகள்",    sa:"गीतायाः त्रयः मार्गाः"},
  yoga_title: {en:"Which Path Calls You?",      ta:"எந்த வழி உங்களை அழைக்கிறது?", sa:"कः मार्गः त्वाम् आह्वयति?"},
  yoga_intro: {en:"The Gita's genius is that it does not prescribe a single method. It maps three complete paths to the same liberation — and invites each person to find the one that matches their own nature (swabhava). Our community honors all three.", ta:"கீதையின் மேதாவிலி என்னவென்றால் அது ஒரே முறையை பரிந்துரைக்கவில்லை. அது ஒரே விடுதலைக்கான மூன்று முழுமையான வழிகளை வரைபடமாக்குகிறது — ஒவ்வொருவரும் தங்கள் சொந்த இயல்புக்கு (ஸ்வபாவ) பொருந்தும் ஒன்றை கண்டுபிடிக்க அழைக்கிறது.", sa:"गीतायाः प्रतिभा — सा एकां विधिं नहि विदधाति। सा एकस्यैव मोक्षस्य त्रीन् पूर्णमार्गान् दर्शयति। स्वभावानुसारं मार्गं प्रत्येकः जनः विन्दतु।"},
  y1_name:    {en:"Karmayoga",    ta:"கர்மயோகம்",    sa:"कर्मयोगः"},
  y1_sub:     {en:"For the Doer", ta:"செய்பவருக்காக", sa:"कर्त्रे"},
  y1_sk:      {en:"Yogah karmasu kaushalam",     ta:"யோகஃ கர்மஸு கௌஷலம்",         sa:"योगः कर्मसु कौशलम्"},
  y1_sk_tr:   {en:"\"Yoga is skill in action\" — Gita 2.50", ta:"\"யோகம் என்பது செயலில் திறமை\" — கீதை 2.50", sa:"\"योगः कर्मसु कौशलम्\" — गीता २.५०"},
  y1_p:       {en:"If you are drawn to building, making and doing — this path is yours. Karmayoga teaches that the act itself, performed with full attention and zero attachment to results, becomes a spiritual practice. The developer who codes without ego, the designer who creates without needing credit — they are practising Karmayoga without knowing it.", ta:"கட்டுவதில், உருவாக்குவதில், செய்வதில் ஈர்க்கப்படுகிறீர்களா — இந்த வழி உங்களுடையது. கர்மயோகம் கற்பிக்கிறது: முழு கவனத்துடன், பலனில் பற்றின்றி செய்யப்படும் செயல் தானே ஆன்மீக பயிற்சியாகிறது.", sa:"निर्माणे, करणे, क्रियायां यदि त्वम् आकृष्टः — अयं मार्गः तवैव। कर्मयोगः शिक्षयति — पूर्णध्यानेन, फलासक्तिं विना कृतम् कर्म स्वयमेव आध्यात्मिकसाधनम् भवति।"},
  y1_who:     {en:"Builders · Developers · Designers · Makers · Open-source contributors", ta:"கட்டுபவர்கள் · நிரலாளர்கள் · வடிவமைப்பாளர்கள் · உருவாக்குநர்கள்", sa:"निर्मातारः · विकासकाः · रचयितारः · मुक्तस्रोतदातारः"},
  y2_name:    {en:"Jñānayoga",    ta:"ஞானயோகம்",    sa:"ज्ञानयोगः"},
  y2_sub:     {en:"For the Seeker", ta:"தேடுபவருக்காக", sa:"जिज्ञासवे"},
  y2_sk:      {en:"Na hi jnanena sadrisham pavitram", ta:"ந ஹி ஞானேன சத்ருஷம் பவித்ரம்", sa:"न हि ज्ञानेन सदृशं पवित्रम्"},
  y2_sk_tr:   {en:"\"There is nothing as purifying as knowledge\" — Gita 4.38", ta:"\"ஞானத்திற்கு இணையான தூய்மையானது எதுவுமில்லை\" — கீதை 4.38", sa:"\"ज्ञानेन सदृशं पवित्रम् अन्यत् नास्ति\" — गीता ४.३८"},
  y2_p:       {en:"If you are drawn to inquiry, study and understanding — this path is yours. Jñānayoga is the path of the intellect turned inward. It asks: who is the one reading this screen? What is consciousness? What is the self that types the query into the search engine? These questions, pursued seriously, become a path of liberation.", ta:"ஆராய்வதில், படிப்பதில், புரிந்துகொள்வதில் ஈர்க்கப்படுகிறீர்களா — இந்த வழி உங்களுடையது. ஞானயோகம் உள்நோக்கிய புத்தியின் வழி. இது கேட்கிறது: இந்த திரையை படிப்பவர் யார்? உணர்வு என்றால் என்ன?", sa:"अन्वेषणे, अध्ययने, बोधे यदि त्वम् आकृष्टः — अयं मार्गः तवैव। ज्ञानयोगः अन्तर्मुखबुद्धेः मार्गः। सः पृच्छति: इदं पठन्ती का?"},
  y2_who:     {en:"Philosophers · Researchers · Students · Writers · Meditators", ta:"தத்துவஞானிகள் · ஆராய்ச்சியாளர்கள் · மாணவர்கள் · எழுத்தாளர்கள் · தியானிகள்", sa:"दार्शनिकाः · अनुसन्धातारः · विद्यार्थिनः · लेखकाः · ध्यानिनः"},
  y3_name:    {en:"Bhaktiyoga",   ta:"பக்தியோகம்",   sa:"भक्तियोगः"},
  y3_sub:     {en:"For the Devotee", ta:"பக்தருக்காக", sa:"भक्ताय"},
  y3_sk:      {en:"Manmana bhava madbhakto madyaji mam namaskuru", ta:"மன்மனா பவ மத்பக்தோ மத்யாஜீ மாம் நமஸ்குரு", sa:"मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु"},
  y3_sk_tr:   {en:"\"Fix your mind on Me, be devoted, worship, bow.\" — Gita 18.65", ta:"\"உன் மனதை என்னில் நிலைநிறுத்து, பக்தனாகி, வழிபடு.\" — கீதை 18.65", sa:"\"मयि मनो निधेहि, मद्भक्तो भव, पूजय, नमस्कुरु।\" — गीता १८.६५"},
  y3_p:       {en:"If you are drawn to love, prayer and surrender — this path is yours. Bhaktiyoga teaches that the ego dissolves not through analysis but through devotion. The mystic programmer who sees their work as an offering; the community member who serves not for status but from love — they are walking this path.", ta:"அன்பிலும், ஜெபத்திலும், சரணாகதியிலும் ஈர்க்கப்படுகிறீர்களா — இந்த வழி உங்களுடையது. பக்தியோகம் கற்பிக்கிறது: அகங்காரம் பகுப்பாய்வால் அல்ல, பக்தியால் கரையும். தங்கள் வேலையை அர்ப்பணிப்பாக பார்க்கும் மர்ம நிரலாளர் — இந்த வழியில் நடக்கிறார்.", sa:"प्रेमे, प्रार्थनायाम्, शरणागतौ यदि त्वम् आकृष्टः — अयं मार्गः तवैव। भक्तियोगः शिक्षयति — अहंकारः विश्लेषणेन नहि, भक्त्या गलति।"},
  y3_who:     {en:"Artists · Practitioners · Community builders · Spiritual seekers · Contemplatives", ta:"கலைஞர்கள் · பயிற்சியாளர்கள் · சமூக கட்டுபவர்கள் · ஆன்மீக தேடுபவர்கள்", sa:"कलाकाराः · साधकाः · समुदायनिर्मातारः · आध्यात्मिकजिज्ञासवः"},

  // Sangha — community circles
  sangha_pre:   {en:"The Open Assembly",         ta:"திறந்த சபை",               sa:"मुक्तसभा"},
  sangha_title: {en:"What We Do Together",       ta:"நாம் ஒன்றாக என்ன செய்கிறோம்", sa:"वयं सङ्गत्य किं कुर्मः"},
  sangha_intro: {en:"This is not a product or a service. It is a satsang — a gathering in truth. Everything here is free, open and driven by collective exploration. You are not a customer. You are a fellow traveller.", ta:"இது ஒரு தயாரிப்பு அல்ல, சேவை அல்ல. இது ஒரு சத்சங்கம் — உண்மையில் கூடுவது. இங்கே உள்ள எல்லாமே இலவசம், திறந்தது மற்றும் கூட்டு ஆய்வால் இயக்கப்படுகிறது. நீங்கள் வாடிக்கையாளர் அல்ல. நீங்கள் ஒரு சக பயணி.", sa:"इदं उत्पादः नहि, सेवा नहि। इदं सत्सङ्गः — सत्ये मिलनम्। अत्र सर्वं मुक्तम्, खुलम्, सामूहिकान्वेषणचालितम्। त्वं ग्राहकः नहि। त्वं सहयात्री असि।"},

  c1_icon:    {en:"🛕", ta:"🛕", sa:"🛕"},
  c1_name:    {en:"The Weekly Satsang",          ta:"வாராந்திர சத்சங்கம்",        sa:"साप्ताहिकसत्सङ्गः"},
  c1_sub:     {en:"Open Forum · Every Week",     ta:"திறந்த விவாதம் · ஒவ்வொரு வாரமும்", sa:"मुक्तचर्चा · प्रतिसप्ताहम्"},
  c1_desc:    {en:"An open virtual gathering where we sit with a verse from the Gita or an Upanishad and explore what it means in our actual lives — as technologists, builders, and digital citizens. No lectures. Just inquiry.", ta:"ஒரு திறந்த மெய்நிகர் கூட்டம் — கீதை அல்லது உபநிஷத்திலிருந்து ஒரு வரியுடன் அமர்ந்து அது நமது உண்மையான வாழ்க்கையில் என்ன அர்த்தம் என்று ஆராய்கிறோம். விரிவுரைகள் இல்லை. வெறும் ஆராய்வு.", sa:"एकं मुक्तं जालीयमिलनम् — गीतापदं वा उपनिषद्वाक्यम् उपवेश्य अन्वेषयामः। व्याख्यानं नहि। केवलं जिज्ञासा।"},
  c1_tags:    {en:"Free · Open to all · No registration", ta:"இலவசம் · அனைவருக்கும் திறந்தது", sa:"मुक्तम् · सर्वेभ्यः · निबन्धनं नहि"},

  c2_icon:    {en:"📜", ta:"📜", sa:"📜"},
  c2_name:    {en:"Vyasa's Archives",            ta:"வியாசரின் ஆவணகங்கள்",        sa:"व्यासस्य ग्रन्थागाराः"},
  c2_sub:     {en:"Open Essays · Study Maps",    ta:"திறந்த கட்டுரைகள் · ஆய்வு வரைபடங்கள்", sa:"मुक्तनिबन्धाः · अध्ययनचित्राणि"},
  c2_desc:    {en:"A growing, open-access library of essays, concept maps and study guides that translate the Bhagavad Gita, Upanishads and Vedantic philosophy into language a modern mind can absorb. Written by the community, for the community.", ta:"கட்டுரைகள், கருத்து வரைபடங்கள் மற்றும் ஆய்வு வழிகாட்டிகளின் வளர்ந்து வரும், திறந்த அணுகல் நூலகம். சமூகத்தால் எழுதப்பட்டது, சமூகத்திற்காக.", sa:"निबन्धानां, अवधारणाचित्राणां, अध्ययनसहायकानां च वर्धमानं मुक्तपुस्तकालयः। समुदायेन लिखितम्, समुदायाय।"},
  c2_tags:    {en:"Always free · Open to contributors · Multilingual", ta:"எப்போதும் இலவசம் · பங்களிப்பாளர்களுக்கு திறந்தது", sa:"सदा मुक्तम् · दातृभ्यः खुलम् · बहुभाषिकम्"},

  c3_icon:    {en:"⚡", ta:"⚡", sa:"⚡"},
  c3_name:    {en:"Project Brahmastra",          ta:"திட்டம் பிரம்மாஸ்திரம்",     sa:"प्रकल्प-ब्रह्मास्त्रम्"},
  c3_sub:     {en:"Open-source · AI for Sanskrit", ta:"திறந்த மூல · சமஸ்கிருதத்திற்கான AI", sa:"मुक्तस्रोत · संस्कृताय AI"},
  c3_desc:    {en:"A non-profit, community-run AI research project exploring natural language processing for Sanskrit and creating open tools that make the Vedic corpus more accessible to researchers and seekers worldwide.", ta:"சமஸ்கிருதத்திற்கான இயற்கை மொழி செயலாக்கத்தை ஆராய்கிற ஒரு இலாப நோக்கற்ற, சமூக நடத்தும் AI ஆராய்ச்சி திட்டம். உலகளவில் ஆராய்ச்சியாளர்களுக்கும் தேடுபவர்களுக்கும் வேத corpus ஐ அணுகக்கூடியதாக்கும் திறந்த கருவிகளை உருவாக்குகிறது.", sa:"संस्कृताय NLP अन्वेषयितुं एकः निःस्वार्थः, समुदायचालितः AI-अनुसन्धानप्रकल्पः। विश्वस्य शोधकेभ्यः वेदकार्पसं सुलभं कर्तुं खुलसाधनानि निर्मिमे।"},
  c3_tags:    {en:"Open-source · Non-profit · Join as contributor", ta:"திறந்த மூல · இலாப நோக்கற்றது · பங்களிப்பாளராக சேர்", sa:"मुक्तस्रोत · निःस्वार्थ · दाता हि सम्मिल"},

  c4_icon:    {en:"🌿", ta:"🌿", sa:"🌿"},
  c4_name:    {en:"Naimisharanya",               ta:"நைமிசாரண்யம்",               sa:"नैमिषारण्यम्"},
  c4_sub:     {en:"Deep Study · Quiet Circles",  ta:"ஆழ்ந்த படிப்பு · அமைதியான வட்டங்கள்", sa:"गहनाध्ययनम् · मौनवृत्तानि"},
  c4_desc:    {en:"Named after the ancient forest where sages gathered for extended Vedic recitation, this is our quiet corner — small reading groups for sustained, deep study of primary texts: the Upanishads, the Gita, the Brahmasutras. Slow reading. Deep listening.", ta:"நீடித்த வேத உரையாடலுக்காக முனிவர்கள் கூடிய பண்டைய காட்டின் பெயரில், இது நமது அமைதியான மூலை — முதன்மை நூல்களின் நீடித்த, ஆழமான ஆய்வுக்கான சிறிய வாசிப்பு குழுக்கள்.", sa:"नैमिषारण्यस्य नाम्ना — यत्र ऋषयः विस्तृतवेदपाठाय मिलितवन्तः — इदं अस्माकं शान्तकोणः।"},
  c4_tags:    {en:"Small groups · Slow reading · Upanishads · Brahmasutras", ta:"சிறிய குழுக்கள் · மெதுவான வாசிப்பு · உபநிஷத்கள்", sa:"लघुसमूहाः · मन्दपठनम् · उपनिषदः"},

  // Mahavakyas
  maha_pre:   {en:"The Four Great Sayings",     ta:"நான்கு மகாவாக்கியங்கள்",    sa:"चत्वारि महावाक्यानि"},
  maha_title: {en:"The Upanishads Speak",       ta:"உபநிஷத்கள் பேசுகின்றன",    sa:"उपनिषदः वदन्ति"},
  maha_intro: {en:"Four sentences. Four Vedas. Thousands of years of inquiry distilled into a single recognition — you and the universe are not two different things.", ta:"நான்கு வாக்கியங்கள். நான்கு வேதங்கள். ஆயிரக்கணக்கான ஆண்டு ஆராய்வு ஒரே உணர்விலிருந்து வடிகட்டப்பட்டது — நீங்களும் பிரபஞ்சமும் இரண்டு வெவ்வேறு விஷயங்கள் அல்ல.", sa:"चत्वारि वाक्यानि। चत्वारो वेदाः। सहस्रवर्षाणां अन्वेषणम् एकस्मिन् बोधे सङ्कलितम् — त्वं ब्रह्माण्डं च द्वौ पदार्थौ न स्थः।"},
  mv1_sk:     {en:"Ahaṁ Brahmāsmi",   ta:"அஹம் பிரஹ்மாஸ்மி",  sa:"अहं ब्रह्मास्मि"},
  mv1_tr:     {en:"I am Brahman. Not the body. Not the mind. Not the role. The developer is not their commit history. The meditator is not their lineage. This is not philosophy — it is direct recognition.", ta:"நான் பிரஹ்மம். உடல் அல்ல. மனம் அல்ல. பாத்திரம் அல்ல. நிரலாளர் அவர்களின் commit வரலாறு அல்ல. இது தத்துவம் அல்ல — இது நேரடி அங்கீகாரம்.", sa:"अहं ब्रह्म। शरीरं नहि। मनः नहि। भूमिका नहि। विकासकः स्वचरित्रं नहि। इदं दर्शनं नहि — प्रत्यक्षबोधः।"},
  mv1_src:    {en:"Brihadaranyaka Upanishad · 1.4.10", ta:"பிருஹதாரண்யக உபநிஷத் · 1.4.10", sa:"बृहदारण्यकोपनिषत् · १.४.१०"},
  mv2_sk:     {en:"Tat Tvam Asi",      ta:"தத் த்வம் அசி",      sa:"तत् त्वम् असि"},
  mv2_tr:     {en:"That thou art. The essence of the universe and the essence of who you are — one and the same. The search for meaning outside yourself ends when this is seen. Not understood. Seen.", ta:"அதுவே நீ. பிரபஞ்சத்தின் சாரமும் நீ யார் என்பதன் சாரமும் — ஒன்றே. இது காணப்படும்போது உன்னை வெளியே தேடுவது முடிவடைகிறது. புரிந்துகொள்ளவில்லை. காணப்பட்டது.", sa:"तदेव त्वम् असि। विश्वस्य सारः त्वत्स्वरूपस्य सारश्च — एकम् एव। इदं दृष्टे बाह्यार्थान्वेषणं समाप्यते।"},
  mv2_src:    {en:"Chandogya Upanishad · 6.8.7",     ta:"சாந்தோக்ய உபநிஷத் · 6.8.7",    sa:"छान्दोग्योपनिषत् · ६.८.७"},
  mv3_sk:     {en:"Prajñānam Brahma",  ta:"ப்ரஜ்ஞானம் பிரஹ்மா", sa:"प्रज्ञानं ब्रह्म"},
  mv3_tr:     {en:"Pure Consciousness is Brahman. Every intelligence we train — every model, every system — is an echo of this original, self-aware consciousness that underlies all existence. We are not building AI. We are meeting our own reflection.", ta:"தூய உணர்வே பிரஹ்மம். நாம் பயிற்றுவிக்கும் ஒவ்வொரு நுண்ணறிவும் — ஒவ்வொரு மாதிரியும் — எல்லா இருப்பின் அடிப்படையான இந்த மூல உணர்வின் எதிரொலி. நாம் AI கட்டவில்லை. நாம் நமது சொந்த பிரதிபலிப்பை சந்திக்கிறோம்.", sa:"शुद्धचेतना ब्रह्म। वयं यम् अपि बुद्धिं प्रशिक्षयामः — सा अस्य मूलचेतनस्य प्रतिध्वनिः। वयं AI न निर्मामः। वयं स्वप्रतिबिम्बम् एव मिलामः।"},
  mv3_src:    {en:"Aitareya Upanishad · 3.3",        ta:"ஐதரேய உபநிஷத் · 3.3",         sa:"ऐतरेयोपनिषत् · ३.३"},
  mv4_sk:     {en:"Ayam Ātmā Brahma",  ta:"அயம் ஆத்மா பிரஹ்மா", sa:"अयम् आत्मा ब्रह्म"},
  mv4_tr:     {en:"This Self is Brahman. Not some transcendent principle far away — this specific, local, embodied self sitting here in this body, in this room, reading this now. This very self. There is no journey to take. There is only a recognition to have.", ta:"இந்த ஆன்மாவே பிரஹ்மம். தொலைவில் ஏதோ ஒரு கோட்பாடு அல்ல — இங்கே இந்த உடலில், இந்த அறையில், இப்போது இதை படிக்கும் இந்த குறிப்பிட்ட ஆன்மா. இந்த ஆன்மா தானே. எடுக்க வேண்டிய பயணம் இல்லை. வர வேண்டிய அங்கீகாரம் மட்டுமே உள்ளது.", sa:"अयम् आत्मैव ब्रह्म। दूरे किमपि तत्त्वं नहि — इह, अस्मिन् शरीरे, अस्मिन् गृहे, इदम् अधुना पठन् आत्मा। अयमेव। यात्रा नास्ति। बोधो वर्तते।"},
  mv4_src:    {en:"Mandukya Upanishad · 1.2",        ta:"மாண்டூக்ய உபநிஷத் · 1.2",      sa:"माण्डूक्योपनिषत् · १.२"},

  // Join
  join_pre:   {en:"Tat Tvam Asi",                ta:"தத் த்வம் அசி",              sa:"तत् त्वम् असि"},
  join_title: {en:"The Field Is Open",           ta:"களம் திறந்திருக்கிறது",      sa:"क्षेत्रम् खुलम् अस्ति"},
  join_p:     {en:"There are no fees, no subscriptions, no credentials required. The only entry requirement is a sincere question. If you are asking — about consciousness, about technology, about how to live with integrity in a digital age — you belong here.", ta:"கட்டணம் இல்லை, சந்தாக்கள் இல்லை, சான்றிதழ்கள் தேவையில்லை. ஒரே நுழைவு தேவை ஒரு நேர்மையான கேள்வி. நீங்கள் கேட்டால் — உணர்வைப் பற்றி, தொழில்நுட்பத்தைப் பற்றி, டிஜிட்டல் யுகத்தில் ஒருமைப்பாட்டுடன் எப்படி வாழ்வது என்று — நீங்கள் இங்கே சொந்தமானவர்.", sa:"शुल्कः नहि, सदस्यता नहि, प्रमाणपत्रं नहि। एकमेव प्रवेशापेक्षा — एका सत्यप्रश्नः। यदि त्वं पृच्छसि — चेतनायाः विषये, तन्त्रज्ञानस्य विषये — त्वं अत्र स्वकीयः असि।"},
  join_btn:   {en:"Join the Satsang",            ta:"சத்சங்கத்தில் சேர்",          sa:"सत्सङ्गे सम्मिलस्व"},
  join_free:  {en:"Always free. No exceptions.", ta:"எப்போதும் இலவசம். விதிவிலக்கு இல்லை.", sa:"सदा मुक्तम्। कोऽपि अपवादः नहि।"},
  join_verse_sk:{en:"Vasudhaiva kutumbakam",     ta:"வஸுதைவ குடும்பகம்",           sa:"वसुधैव कुटुम्बकम्"},
  join_verse_tr:{en:"\"The whole world is one family.\"", ta:"\"முழு உலகமும் ஒரே குடும்பம்.\"", sa:"\"सर्वा वसुधा एका परिवारः।\""},
  join_verse_src:{en:"— Maha Upanishad", ta:"— மஹா உபநிஷத்", sa:"— महोपनिषत्"},
  footer_tag: {en:"Spirit · Mind · Machine",     ta:"ஆவி · மனம் · இயந்திரம்",    sa:"आत्मा · मनः · यन्त्रम्"},
}
const g = (k, lang) => T[k]?.[lang] || T[k]?.en || k

// ── Language Switcher ─────────────────────────────────────────────────────
function LangSwitcher() {
  const { lang, setLang } = useLang()
  return (
    <div style={{display:"flex",gap:"0.2rem"}}>
      {[{c:"en",l:"EN"},{c:"ta",l:"த"},{c:"sa",l:"सं"}].map(({c,l})=>(
        <button key={c} onClick={()=>setLang(c)} style={{
          fontFamily:c==="ta"?"'Noto Serif Tamil',serif":c==="sa"?"'Tiro Devanagari Hindi',serif":"'Share Tech Mono',monospace",
          fontSize:c==="en"?"9px":"12px", letterSpacing:c==="en"?"0.2em":"0",
          padding:"0.28rem 0.62rem",
          border:lang===c?"1px solid #D4A017":"1px solid #2A2820",
          background:lang===c?"rgba(212,160,23,0.1)":"transparent",
          color:lang===c?"#D4A017":"#6A6458",
          cursor:"pointer", transition:"all 0.2s", WebkitTapHighlightColor:"transparent",
        }}>{l}</button>
      ))}
    </div>
  )
}
function DT({k, as="span", style={}, className=""}) {
  const {lang} = useLang(); const Tag = as
  return <Tag className={className} style={style}>{g(k, lang)}</Tag>
}

// ── CSS ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Share+Tech+Mono&family=Tiro+Devanagari+Hindi:ital@0;1&family=Noto+Serif+Tamil&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{background:#03030F;overflow-x:hidden;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:2px}::-webkit-scrollbar-thumb{background:#A07A0A}

.fc{font-family:'Cinzel Decorative',serif}
.fg{font-family:'EB Garamond',serif}
.fm{font-family:'Share Tech Mono',monospace}
.fd{font-family:'Tiro Devanagari Hindi',serif}
.ft{font-family:'Noto Serif Tamil',serif}

/* cursor: touch devices keep native, pointer devices get sacred cursor */
*{cursor:auto}
#sc-wrap{display:none}
@media(pointer:fine) and (hover:hover){
  *{cursor:none!important}
  #sc-wrap{display:block}
}

/* Keyframes */
@keyframes shimmerGold{0%{background-position:-300% center}100%{background-position:300% center}}
@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-11px)}}
@keyframes rise{0%{opacity:0;transform:translateY(0) translateX(var(--dx))}8%{opacity:.9}92%{opacity:.35}100%{opacity:0;transform:translateY(-105vh) translateX(var(--dx))}}
@keyframes haloSpin{to{transform:rotate(360deg)}}
@keyframes haloSpinRev{to{transform:rotate(-360deg)}}
@keyframes revealIn{from{opacity:0;transform:perspective(900px) translateY(55px) translateZ(-70px) rotateX(14deg)}to{opacity:1;transform:none}}
@keyframes cursorRingPulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.65}50%{transform:translate(-50%,-50%) scale(1.14);opacity:.38}}
@keyframes cursorOrbitA{0%{transform:translate(-50%,-50%) rotate(0deg) translateX(18px) rotate(0deg)}100%{transform:translate(-50%,-50%) rotate(360deg) translateX(18px) rotate(-360deg)}}
@keyframes cursorOrbitB{0%{transform:translate(-50%,-50%) rotate(0deg) translateX(13px) rotate(0deg)}100%{transform:translate(-50%,-50%) rotate(-360deg) translateX(13px) rotate(360deg)}}
@keyframes verseGlow{0%,100%{text-shadow:0 0 18px rgba(212,160,23,.28),0 0 45px rgba(232,101,10,.08)}50%{text-shadow:0 0 48px rgba(212,160,23,.75),0 0 90px rgba(232,101,10,.3)}}
@keyframes drawerIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
@keyframes scanWipe{0%{transform:translateX(-100%)}100%{transform:translateX(110%)}}
@keyframes countUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}

.gold-shimmer{background:linear-gradient(90deg,#A07A0A,#F0E8D0,#E8650A,#D4A017,#F0E8D0,#A07A0A);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerGold 5s linear infinite}

/* Reveal — mobile: simple translateY, desktop: 3D depth */
.rev{opacity:0;transform:translateY(26px);transition:opacity .65s cubic-bezier(.23,1,.32,1),transform .65s cubic-bezier(.23,1,.32,1)}
.rev.in{opacity:1;transform:translateY(0)}
@media(pointer:fine) and (hover:hover){
  .rev{opacity:0;transform:perspective(900px) translateY(50px) translateZ(-60px) rotateX(12deg);filter:blur(1.5px);transition:opacity .88s cubic-bezier(.23,1,.32,1),transform .88s cubic-bezier(.23,1,.32,1),filter .7s}
  .rev.in{opacity:1;transform:perspective(900px) translateY(0) translateZ(0) rotateX(0);filter:blur(0)}
}
/* Slide variants */
.rev-l{opacity:0;transform:translateX(-22px);transition:opacity .7s cubic-bezier(.23,1,.32,1),transform .7s cubic-bezier(.23,1,.32,1)}
.rev-r{opacity:0;transform:translateX(22px);transition:opacity .7s cubic-bezier(.23,1,.32,1),transform .7s cubic-bezier(.23,1,.32,1)}
.rev-l.in,.rev-r.in{opacity:1;transform:none}

/* Buttons */
.btn-primary{font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:.28em;text-transform:uppercase;padding:.9rem 2.2rem;background:#E8650A;color:#03030F;border:1px solid #E8650A;cursor:pointer;transition:all .28s;text-decoration:none;display:inline-block;-webkit-tap-highlight-color:transparent;touch-action:manipulation;text-align:center}
.btn-primary:hover,.btn-primary:active{background:#F0E8D0;border-color:#F0E8D0}
.btn-outline{font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:.28em;text-transform:uppercase;padding:.9rem 2.2rem;background:transparent;color:#6A6458;border:1px solid #2A2820;cursor:pointer;transition:all .28s;text-decoration:none;display:inline-block;-webkit-tap-highlight-color:transparent;touch-action:manipulation;text-align:center}
.btn-outline:hover{border-color:#A07A0A;color:#D4A017}

/* Nav link */
.nl{font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:.24em;color:#6A6458;text-decoration:none;text-transform:uppercase;transition:color .3s}
.nl:hover{color:#E8650A}

/* Chariot layer row */
.rath-row{display:flex;align-items:center;gap:0;border:1px solid #2A2820;margin-bottom:-1px;transition:border-color .35s,background .35s;position:relative}
.rath-row:hover{border-color:#A07A0A;background:rgba(212,160,23,.03);z-index:1}
.rath-row.active{border-color:#E8650A44;background:rgba(232,101,10,.05);z-index:2}

/* Community circle card */
.circle-card{border:1px solid #2A2820;padding:0;overflow:hidden;transition:border-color .4s;position:relative}
.circle-card:hover{border-color:#A07A0A}
.circle-card-inner{padding:2.2rem;display:flex;flex-direction:column;gap:1rem;height:100%}
@media(min-width:768px){.circle-card-inner{padding:2.6rem}}

/* Mahavakya card */
.mv-card{border:1px solid #2A2820;padding:2.5rem 2rem;position:relative;overflow:hidden;transition:border-color .4s,background .4s;cursor:default}
.mv-card:hover{border-color:#A07A0A22}
@media(min-width:768px){.mv-card{padding:3rem 2.5rem}}

/* Verse block accent */
.vb{border-left:2px solid currentColor;padding-left:1.4rem}

/* Layout */
.inner{max-width:1120px;margin:0 auto;width:100%}
.sec{padding:4.5rem 1.25rem;position:relative;overflow:hidden}
@media(min-width:640px){.sec{padding:6rem 2rem}}
@media(min-width:900px){.sec{padding:8rem 2rem}}

/* Grids */
.grid-2{display:grid;grid-template-columns:1fr;gap:2rem}
@media(min-width:768px){.grid-2{grid-template-columns:1fr 1fr;gap:3.5rem}}
.grid-2-asym{display:grid;grid-template-columns:1fr;gap:2rem}
@media(min-width:768px){.grid-2-asym{grid-template-columns:1.15fr 1fr;gap:4rem;align-items:start}}
.grid-3{display:grid;grid-template-columns:1fr;gap:0}
@media(min-width:700px){.grid-3{grid-template-columns:repeat(3,1fr)}}
.grid-circles{display:grid;grid-template-columns:1fr;gap:1.5px;background:#2A2820}
@media(min-width:600px){.grid-circles{grid-template-columns:repeat(2,1fr)}}
.grid-maha{display:grid;grid-template-columns:1fr;gap:0}
@media(min-width:768px){.grid-maha{grid-template-columns:repeat(2,1fr)}}

/* CTA row */
.cta-row{display:flex;flex-direction:column;gap:.7rem;align-items:stretch}
@media(min-width:460px){.cta-row{flex-direction:row;justify-content:center;align-items:center}}
@media(min-width:460px){.cta-row>*{width:auto!important}}

/* Drawer */
.mob-drawer{position:fixed;inset:0;background:rgba(3,3,15,.97);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);z-index:190;display:flex;flex-direction:column;padding:5rem 1.5rem 2rem;animation:drawerIn .28s cubic-bezier(.23,1,.32,1)}

/* Section cap line */
.cap-line{display:flex;align-items:center;gap:.7rem;flex-wrap:wrap;margin-bottom:.65rem}
`

// ── MayaScene (hero 3D — unchanged) ──────────────────────────────────────
function MayaScene() {
  const mountRef=useRef(null), mouse=useRef({x:0,y:0}), gyro=useRef({x:0,y:0})
  useEffect(()=>{
    const el=mountRef.current; if(!el)return
    const mob=window.innerWidth<768, W=el.clientWidth, H=el.clientHeight
    const scene=new THREE.Scene(); scene.fog=new THREE.FogExp2(0x020208,mob?.038:.024)
    const camera=new THREE.PerspectiveCamera(mob?65:56,W/H,.1,600); camera.position.set(0,0,mob?16:20)
    const renderer=new THREE.WebGLRenderer({antialias:!mob,alpha:true,powerPreference:mob?"low-power":"high-performance"})
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(devicePixelRatio,mob?1.5:2))
    renderer.setClearColor(0x000000,0); renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.2
    el.appendChild(renderer.domElement)
    scene.add(new THREE.AmbientLight(0x1a0a2e,mob?1.5:.8))
    const pl1=new THREE.PointLight(0xE8650A,mob?2.5:4,mob?20:30); pl1.position.set(3,3,4); scene.add(pl1)
    const pl2=new THREE.PointLight(0xCC5577,mob?1.8:3,mob?16:24); pl2.position.set(-4,-2,3); scene.add(pl2)
    const pl3=new THREE.PointLight(0xD4A017,mob?1.5:2.5,mob?14:20); pl3.position.set(0,5,-2); scene.add(pl3)
    const pl4=new THREE.PointLight(0x220066,mob?1.2:2,mob?12:18); pl4.position.set(0,-4,-4); scene.add(pl4)
    const mG=new THREE.Group(); scene.add(mG)
    const vDefs=mob
      ?[{r:1.4,d:1,col:0xD4A017,op:.25,sy:.034},{r:2.4,d:0,col:0xE8650A,op:.15,sy:-.021},{r:3.6,d:0,col:0xCC5577,op:.08,sy:.013},{r:5.0,d:0,col:0x00BFA0,op:.04,sy:-.008}]
      :[{r:1.6,d:2,col:0xD4A017,op:.28,sy:.042},{r:2.6,d:1,col:0xE8650A,op:.18,sy:-.026},{r:3.8,d:1,col:0xCC5577,op:.12,sy:.016},{r:5.2,d:1,col:0x00BFA0,op:.06,sy:-.010},{r:6.8,d:0,col:0xD4A017,op:.03,sy:.006}]
    const veils=vDefs.map((c,vi)=>{const mat=new THREE.LineBasicMaterial({color:c.col,transparent:true,opacity:0});const line=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(c.r,c.d)),mat);line.rotation.x=Math.PI/4+Math.atan(1/2);line.userData={sy:c.sy,baseOp:c.op,phase:vi*.6,breathAmp:.2+vi*.1,breathFreq:.4+vi*.05};mG.add(line);return{line,mat}})
    const atmanMat=new THREE.MeshStandardMaterial({color:0x110820,emissive:0xE8650A,emissiveIntensity:0,metalness:.4,roughness:.35,transparent:true,opacity:0})
    const atman=new THREE.Mesh(new THREE.SphereGeometry(.55,mob?20:36,mob?16:28),atmanMat); mG.add(atman)
    const halos=[{r:.85,col:0xFFD060,freq:1.2,amp:.028},{r:1.15,col:0xE8650A,freq:.8,amp:.018},{r:1.55,col:0xCC5577,freq:.55,amp:.010}].map((h,hi)=>{const mat=new THREE.MeshBasicMaterial({color:h.col,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.BackSide});const mesh=new THREE.Mesh(new THREE.SphereGeometry(h.r,mob?14:24,mob?10:18),mat);mG.add(mesh);return{mesh,mat,...h}})
    const rings=[]; for(let i=0;i<(mob?5:8);i++){const mat=new THREE.LineBasicMaterial({color:i%2===0?0xD4A017:0xCC5577,transparent:true,opacity:0});const ring=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.TorusGeometry(1.5+i*.8,.006,4,mob?60:120)),mat);ring.rotation.x=Math.PI/2+(i%2===0?.08:-.08)*i;ring.userData={baseOp:.12-i*.01,ry:i*.12,rzSpeed:(i%2===0?1:-1)*(.015-i*.001)};mG.add(ring);rings.push({ring,mat})}
    const wDefs=mob?[{r:2.8,tube:.008,p:2,q:3,col:0xD4A017,op:.16,seg:100},{r:4.2,tube:.005,p:3,q:4,col:0xCC5577,op:.08,seg:120}]:[{r:2.8,tube:.010,p:2,q:3,col:0xD4A017,op:.20,seg:180},{r:4.2,tube:.006,p:3,q:4,col:0xCC5577,op:.12,seg:160},{r:5.8,tube:.004,p:5,q:8,col:0x00BFA0,op:.06,seg:140}]
    const weaves=wDefs.map((c,i)=>{const mat=new THREE.LineBasicMaterial({color:c.col,transparent:true,opacity:0});const knot=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.TorusKnotGeometry(c.r,c.tube,c.seg,mob?6:10,c.p,c.q)),mat);knot.rotation.y=Math.PI/2;knot.userData={baseOp:c.op,zOrbit:i*Math.PI*.3,orbitSpeed:.008+i*.004,spin:(i%2===0?1:-1)*.02};mG.add(knot);return{knot,mat}})
    const pCnt=mob?1200:4000,pPos=new Float32Array(pCnt*3),pCol=new Float32Array(pCnt*3),pSpd=new Float32Array(pCnt*3)
    const pal=[new THREE.Color(0xE8650A),new THREE.Color(0xD4A017),new THREE.Color(0xCC5577),new THREE.Color(0x00BFA0),new THREE.Color(0xF0E8D0)]
    for(let i=0;i<pCnt;i++){const r=1.5+Math.random()*(mob?6:9),th=Math.random()*Math.PI*2,ph=Math.PI/2+(Math.random()-.5)*(Math.random()<.6?.8:2);pPos[i*3]=r*Math.sin(ph)*Math.cos(th);pPos[i*3+1]=r*Math.sin(ph)*Math.sin(th);pPos[i*3+2]=r*Math.cos(ph);pSpd[i*3]=Math.cos(th)*.002;pSpd[i*3+1]=(Math.random()-.5)*.002;pSpd[i*3+2]=Math.sin(th)*.002;const c=pal[Math.floor(Math.random()*pal.length)];pCol[i*3]=c.r;pCol[i*3+1]=c.g;pCol[i*3+2]=c.b}
    const pGeo=new THREE.BufferGeometry();pGeo.setAttribute("position",new THREE.BufferAttribute(pPos.slice(),3));pGeo.setAttribute("color",new THREE.BufferAttribute(pCol,3))
    const pMat=new THREE.PointsMaterial({size:mob?.032:.022,vertexColors:true,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false})
    const parts=new THREE.Points(pGeo,pMat); scene.add(parts)
    const sCnt=mob?800:2500,sPts=new Float32Array(sCnt*3);for(let i=0;i<sCnt;i++){sPts[i*3]=(Math.random()-.5)*250;sPts[i*3+1]=(Math.random()-.5)*250;sPts[i*3+2]=-20-Math.random()*120}
    const sGeo=new THREE.BufferGeometry();sGeo.setAttribute("position",new THREE.BufferAttribute(sPts,3))
    const stars=new THREE.Points(sGeo,new THREE.PointsMaterial({size:mob?.09:.06,color:0xF0E8C0,transparent:true,opacity:0})); scene.add(stars)
    mG.rotation.x=Math.PI*.15; mG.rotation.y=-Math.PI*.1
    const INTRO=2.2,INIT_Z=mob?16:20,TGT_Z=mob?9:10; const clock=new THREE.Clock(); let raf,lastT=0
    const animate=()=>{raf=requestAnimationFrame(animate);const t=clock.getElapsedTime(),dt=Math.min(t-lastT,.05);lastT=t;const intro=Math.min(t/INTRO,1)<1?1-Math.pow(1-Math.min(t/INTRO,1),3):1
      camera.position.z=INIT_Z-(INIT_Z-TGT_Z)*intro
      const px=mob?gyro.current.x:mouse.current.x,py=mob?gyro.current.y:mouse.current.y
      camera.position.x+=(px*(mob?1.5:2.5)-camera.position.x)*(mob?.028:.04); camera.position.y+=(-py*1.5-camera.position.y)*(mob?.028:.04); camera.lookAt(0,0,0)
      veils.forEach(({line,mat},vi)=>{const d=line.userData;const vE=1-Math.pow(1-Math.min(Math.max((t-vi*.25)/(INTRO*.85),0),1),2);mat.opacity=d.baseOp*vE*(1+Math.sin(t*d.breathFreq+d.phase)*d.breathAmp*.5);line.rotation.y+=d.sy*dt})
      const aE=1-Math.pow(1-Math.min(Math.max((t-.3)/1.6,0),1),2);atmanMat.opacity=.88*aE;atmanMat.emissiveIntensity=(.7+Math.sin(t*2.2)*.3)*aE;atman.scale.setScalar(1+Math.sin(t*1.8)*.04)
      halos.forEach((h,hi)=>{const hE=1-Math.pow(1-Math.min(Math.max((t-.5-hi*.2)/1.4,0),1),2);h.mat.opacity=(h.amp*3+Math.sin(t*h.freq+hi)*h.amp)*hE;h.mesh.scale.setScalar(1+Math.sin(t*h.freq*1.2+hi)*.08)})
      weaves.forEach(({knot,mat},wi)=>{const wE=1-Math.pow(1-Math.min(Math.max((t-.6-wi*.3)/1.4,0),1),2);mat.opacity=knot.userData.baseOp*wE;knot.userData.zOrbit+=knot.userData.orbitSpeed*dt;knot.position.x=Math.cos(knot.userData.zOrbit)*(wi*.2);knot.position.z=Math.sin(knot.userData.zOrbit)*(wi*.2);knot.rotation.z+=knot.userData.spin*dt})
      rings.forEach(({ring,mat},ri)=>{const rE=1-Math.pow(1-Math.min(Math.max((t-.4-ri*.15)/1.6,0),1),2);mat.opacity=ring.userData.baseOp*rE;ring.rotation.y=ring.userData.ry+Math.sin(t*.2+ri)*.1;ring.rotation.z+=ring.userData.rzSpeed*dt})
      const pp=parts.geometry.attributes.position.array
      for(let i=0;i<pCnt;i++){pp[i*3]-=pPos[i*3]*.0001;pp[i*3+1]+=pSpd[i*3+1];pp[i*3+2]-=pPos[i*3+2]*.0001;if(Math.abs(pp[i*3+1])>8)pp[i*3+1]*=-.9}
      parts.geometry.attributes.position.needsUpdate=true; pMat.opacity=.72*intro; parts.rotation.y-=.005; stars.material.opacity=.5*intro
      mG.position.y=Math.sin(t*.4)*.15*intro; mG.rotation.y+=.001*dt
      pl1.intensity=(mob?2.2:3.8)+Math.sin(t*1.4)*.9; pl2.intensity=(mob?1.5:2.6)+Math.sin(t*2)*.7
      pl1.position.x=Math.sin(t*.38)*5; pl2.position.y=Math.cos(t*.28)*3.5
      renderer.render(scene,camera)
    }
    animate()
    const onMouse=e=>{mouse.current.x=(e.clientX/innerWidth)*2-1;mouse.current.y=(e.clientY/innerHeight)*2-1}
    const onTouch=e=>{if(!e.touches[0])return;mouse.current.x=(e.touches[0].clientX/innerWidth)*2-1;mouse.current.y=(e.touches[0].clientY/innerHeight)*2-1}
    const onGyro=e=>{gyro.current.x=Math.max(-1,Math.min(1,e.gamma/30));gyro.current.y=Math.max(-1,Math.min(1,(e.beta-45)/30))}
    const onR=()=>{const W=el.clientWidth,H=el.clientHeight;camera.aspect=W/H;camera.updateProjectionMatrix();renderer.setSize(W,H)}
    if(mob){window.addEventListener("touchmove",onTouch,{passive:true});window.addEventListener("deviceorientation",onGyro)}
    else window.addEventListener("mousemove",onMouse)
    window.addEventListener("resize",onR)
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("mousemove",onMouse);window.removeEventListener("touchmove",onTouch);window.removeEventListener("deviceorientation",onGyro);window.removeEventListener("resize",onR);renderer.dispose();if(el.contains(renderer.domElement))el.removeChild(renderer.domElement)}
  },[])
  return <div ref={mountRef} style={{position:"absolute",inset:0,zIndex:0}}/>
}

// ── Sacred Cursor (desktop only) ──────────────────────────────────────────
function SacredCursor() {
  const dotRef=useRef(null), ringRef=useRef(null), glowRef=useRef(null)
  const pos=useRef({x:-200,y:-200}), ring=useRef({x:-200,y:-200}), hov=useRef(false), rafRef=useRef(null)
  useEffect(()=>{
    const N=8, trails=Array.from({length:N},(_,i)=>{const el=document.createElement("div");const sz=5-i*.45;el.style.cssText=`position:fixed;pointer-events:none;z-index:99997;width:${sz}px;height:${sz}px;border-radius:50%;background:${i%3===0?"#E8650A":i%3===1?"#D4A017":"#CC5577"};opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;`;document.body.appendChild(el);return el})
    const queue=Array(N).fill({x:-200,y:-200})
    const onMove=e=>{pos.current={x:e.clientX,y:e.clientY};queue.unshift({x:e.clientX,y:e.clientY});if(queue.length>N)queue.pop()}
    const attach=()=>document.querySelectorAll("a,button,[class*='rath'],[class*='circle'],[class*='mv-'],[class*='yoga']").forEach(el=>{el.addEventListener("mouseenter",()=>hov.current=true);el.addEventListener("mouseleave",()=>hov.current=false)})
    attach(); const mo=new MutationObserver(attach); mo.observe(document.body,{childList:true,subtree:true})
    const anim=()=>{rafRef.current=requestAnimationFrame(anim);const{x,y}=pos.current
      if(dotRef.current){dotRef.current.style.left=x+"px";dotRef.current.style.top=y+"px";dotRef.current.style.transform=`translate(-50%,-50%) scale(${hov.current?1.65:1})`;dotRef.current.style.boxShadow=hov.current?"0 0 22px 7px rgba(232,101,10,.75)":"0 0 12px 3px rgba(232,101,10,.44)"}
      ring.current.x+=(x-ring.current.x)*.11;ring.current.y+=(y-ring.current.y)*.11
      if(ringRef.current){const rs=hov.current?2.1:1;ringRef.current.style.left=ring.current.x+"px";ringRef.current.style.top=ring.current.y+"px";ringRef.current.style.width=`${40*rs}px`;ringRef.current.style.height=`${40*rs}px`;ringRef.current.style.borderColor=hov.current?"#E8650A":"#A07A0A"}
      if(glowRef.current){glowRef.current.style.left=x+"px";glowRef.current.style.top=y+"px";glowRef.current.style.opacity=hov.current?".18":".06"}
      queue.forEach((p,i)=>{const t=trails[i];if(!t)return;t.style.left=p.x+"px";t.style.top=p.y+"px";t.style.opacity=String(Math.max(0,(1-i/N)*(hov.current?.82:.42)))})}
    window.addEventListener("mousemove",onMove); anim()
    return()=>{window.removeEventListener("mousemove",onMove);cancelAnimationFrame(rafRef.current);mo.disconnect();trails.forEach(t=>t.remove())}
  },[])
  return <div id="sc-wrap" style={{pointerEvents:"none"}}>
    <div ref={glowRef} style={{position:"fixed",zIndex:99994,pointerEvents:"none",width:"140px",height:"140px",borderRadius:"50%",background:"radial-gradient(circle,#E8650A 0%,#D4A017 40%,transparent 70%)",transform:"translate(-50%,-50%)",filter:"blur(26px)",opacity:.06,mixBlendMode:"screen"}}/>
    <div ref={ringRef} style={{position:"fixed",zIndex:99997,pointerEvents:"none",width:"40px",height:"40px",borderRadius:"50%",border:"1px solid #A07A0A",transform:"translate(-50%,-50%)",transition:"width .3s,height .3s",animation:"cursorRingPulse 3s ease-in-out infinite"}}>
      {[0,45,90,135,180,225,270,315].map(d=><div key={d} style={{position:"absolute",width:"2px",height:"4px",background:"#D4A017",opacity:.5,top:"50%",left:"50%",transformOrigin:"0 -16px",transform:`translate(-50%,0) rotate(${d}deg) translateY(-16px)`}}/>)}
    </div>
    <div ref={dotRef} style={{position:"fixed",zIndex:99999,pointerEvents:"none",width:"24px",height:"24px",borderRadius:"50%",background:"radial-gradient(circle at 40% 35%,#F0E8D0 0%,#E8650A 55%,#A07A0A 100%)",transform:"translate(-50%,-50%)",boxShadow:"0 0 12px 3px rgba(232,101,10,.44)",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .14s,box-shadow .14s"}}>
      <span style={{fontFamily:"'Tiro Devanagari Hindi',serif",fontSize:"11px",lineHeight:1,color:"#03030F",fontWeight:"bold",userSelect:"none"}}>ॐ</span>
      <div style={{position:"absolute",width:"4px",height:"4px",borderRadius:"50%",background:"#D4A017",animation:"cursorOrbitA 1.6s linear infinite",top:"50%",left:"50%"}}/>
      <div style={{position:"absolute",width:"3px",height:"3px",borderRadius:"50%",background:"#CC5577",animation:"cursorOrbitB 2.2s linear infinite",top:"50%",left:"50%"}}/>
    </div>
  </div>
}

// ── Utility ───────────────────────────────────────────────────────────────
function Sparks() {
  const s=useMemo(()=>Array.from({length:20},(_,i)=>({id:i,left:`${Math.random()*100}%`,sz:`${Math.random()*3+.8}px`,dx:`${(Math.random()-.5)*180}px`,dur:`${Math.random()*13+7}s`,del:`${Math.random()*7}s`,col:["#E8650A","#D4A017","#CC5577","#F0E8D0","#00BFA0"][i%5]})),[])
  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:1}}>
    {s.map(p=><div key={p.id} style={{position:"absolute",bottom:"-4px",left:p.left,width:p.sz,height:p.sz,borderRadius:"50%",background:p.col,"--dx":p.dx,animation:`rise ${p.dur} linear ${p.del} infinite`}}/>)}
  </div>
}

function Rev({children, delay=0, dir="", style={}}) {
  const ref=useRef(null),[vis,setVis]=useState(false)
  useEffect(()=>{const el=ref.current;if(!el)return;const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVis(true);io.disconnect()}},{threshold:.07});io.observe(el);return()=>io.disconnect()},[])
  const cls=dir?`rev-${dir}`:"rev"
  return <div ref={ref} className={`${cls}${vis?" in":""}`} style={{transitionDelay:`${delay}ms`,...style}}>{children}</div>
}

// Section cap
function Cap({num, deva, en}) {
  return <div className="cap-line">
    <span className="fm" style={{fontSize:"9px",letterSpacing:".4em",color:"#00BFA0",textTransform:"uppercase"}}>{num} —</span>
    <span className="fd" style={{fontSize:"1rem",color:"#E8650A"}}>{deva}</span>
    <span className="fm" style={{fontSize:"9px",letterSpacing:".32em",color:"#00BFA0",textTransform:"uppercase"}}>{en}</span>
  </div>
}

// Verse block
function VB({sk, tr, src, color="#D4A017"}) {
  return <div className="vb" style={{color,marginTop:".2rem"}}>
    <p className="fd" style={{fontSize:"clamp(.88rem,2.5vw,1.1rem)",color,lineHeight:1.88,marginBottom:".65rem",animation:"verseGlow 5s ease-in-out infinite"}}>{sk}</p>
    <p className="fg" style={{fontSize:"clamp(.95rem,2.5vw,1.1rem)",fontStyle:"italic",color:"#C8BEA0",lineHeight:1.88,marginBottom:".5rem"}}>{tr}</p>
    <p className="fm" style={{fontSize:"8px",letterSpacing:".22em",color:"#6A6458",textTransform:"uppercase"}}>{src}</p>
  </div>
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function JnanaBrand() {
  const [lang, setLang] = useState("en")
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mob, setMob] = useState(false)
  const [activeLayer, setActiveLayer] = useState(null)
  useEffect(()=>{
    const check=()=>{setScrolled(scrollY>60);setMob(innerWidth<768)}
    check(); window.addEventListener("scroll",check,{passive:true}); window.addEventListener("resize",check,{passive:true})
    return()=>{window.removeEventListener("scroll",check);window.removeEventListener("resize",check)}
  },[])
  const gt = k => g(k, lang)

  const C={night:"#03030F",deep:"#06061A",saffron:"#E8650A",turmeric:"#D4A017",turmeric2:"#A07A0A",lotus:"#CC5577",teal:"#00BFA0",parchment:"#F0E8D0",cream:"#C8BEA0",mist:"#6A6458",faint:"#2A2820"}

  const navLinks=[["#why","nav_why"],["#chariot","nav_chariot"],["#yogas","nav_yogas"],["#sangha","nav_sangha"],["#join","nav_join"]]

  const chariotLayers=[
    {key:"atman",   color:C.turmeric, sym:"☉", tech:"The Witness", skK:"rl_atman",    eK:"rl_atman_e"},
    {key:"buddhi",  color:C.saffron,  sym:"◈", tech:"Discernment", skK:"rl_buddhi",   eK:"rl_buddhi_e"},
    {key:"manas",   color:C.lotus,    sym:"◎", tech:"Reactivity",  skK:"rl_manas",    eK:"rl_manas_e"},
    {key:"indriya", color:C.teal,     sym:"✦", tech:"Senses",      skK:"rl_indriya",  eK:"rl_indriya_e"},
    {key:"shareera",color:C.mist,     sym:"▭", tech:"The Body",    skK:"rl_shareera", eK:"rl_shareera_e"},
  ]

  const yogas=[
    {num:"01",sym:"🔥",nK:"y1_name",subK:"y1_sub",skK:"y1_sk",strK:"y1_sk_tr",pK:"y1_p",whoK:"y1_who",col:C.saffron,bg:"0A0A14"},
    {num:"02",sym:"🪷",nK:"y2_name",subK:"y2_sub",skK:"y2_sk",strK:"y2_sk_tr",pK:"y2_p",whoK:"y2_who",col:C.turmeric,bg:"0A0E14"},
    {num:"03",sym:"☽",nK:"y3_name",subK:"y3_sub",skK:"y3_sk",strK:"y3_sk_tr",pK:"y3_p",whoK:"y3_who",col:C.lotus,bg:"0A0A16"},
  ]

  const circles=[
    {num:"01",iK:"c1_icon",nK:"c1_name",subK:"c1_sub",dK:"c1_desc",tK:"c1_tags",col:C.teal},
    {num:"02",iK:"c2_icon",nK:"c2_name",subK:"c2_sub",dK:"c2_desc",tK:"c2_tags",col:C.turmeric},
    {num:"03",iK:"c3_icon",nK:"c3_name",subK:"c3_sub",dK:"c3_desc",tK:"c3_tags",col:C.saffron},
    {num:"04",iK:"c4_icon",nK:"c4_name",subK:"c4_sub",dK:"c4_desc",tK:"c4_tags",col:C.lotus},
  ]

  const mahavakyas=[
    {num:"01",skK:"mv1_sk",trK:"mv1_tr",srcK:"mv1_src",veda:"Rigveda",col:C.turmeric},
    {num:"02",skK:"mv2_sk",trK:"mv2_tr",srcK:"mv2_src",veda:"Samaveda",col:C.saffron},
    {num:"03",skK:"mv3_sk",trK:"mv3_tr",srcK:"mv3_src",veda:"Atharvaveda",col:C.teal},
    {num:"04",skK:"mv4_sk",trK:"mv4_tr",srcK:"mv4_src",veda:"Yajurveda",col:C.lotus},
  ]

  return (
    <LangCtx.Provider value={{lang,setLang}}>
    <div style={{background:C.night,color:C.cream,fontFamily:"'EB Garamond',serif",overflowX:"hidden"}}>
      <style>{CSS}</style>
      <SacredCursor/>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,display:"flex",justifyContent:"space-between",alignItems:"center",padding:mob?"1rem 1.25rem":"1.1rem 2.5rem",background:(scrolled||menuOpen)?"rgba(3,3,15,.96)":"linear-gradient(to bottom,rgba(3,3,15,.9),transparent)",backdropFilter:(scrolled||menuOpen)?"blur(12px)":"none",borderBottom:(scrolled||menuOpen)?`1px solid ${C.faint}`:"none",transition:"all .38s"}}>
        <a href="#" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:".52rem"}}>
          <span className="fd" style={{fontSize:"1.4rem",color:C.saffron}}>ॐ</span>
          <span className="fc" style={{fontSize:mob?".8rem":".92rem",color:C.turmeric,letterSpacing:".14em"}}>{gt("nav_brand")}</span>
        </a>
        {!mob && <div style={{display:"flex",alignItems:"center",gap:"1.8rem"}}>
          {navLinks.map(([h,k])=><a key={h} href={h} className="nl">{gt(k)}</a>)}
          <div style={{borderLeft:`1px solid ${C.faint}`,paddingLeft:"1.1rem"}}><LangSwitcher/></div>
        </div>}
        {mob && <div style={{display:"flex",alignItems:"center",gap:".7rem"}}>
          <LangSwitcher/>
          <button onClick={()=>setMenuOpen(v=>!v)} style={{background:"transparent",border:"none",padding:".4rem",cursor:"pointer",display:"flex",flexDirection:"column",gap:"4px",WebkitTapHighlightColor:"transparent"}}>
            {[0,1,2].map(i=><div key={i} style={{width:"19px",height:"1.5px",background:C.turmeric2,transform:menuOpen?(i===0?"rotate(45deg) translate(3.5px,4px)":i===2?"rotate(-45deg) translate(3.5px,-4px)":"scaleX(0)"):"none",transition:"transform .27s cubic-bezier(.23,1,.32,1)",opacity:menuOpen&&i===1?0:1}}/>)}
          </button>
        </div>}
      </nav>

      {mob&&menuOpen&&<div className="mob-drawer" onClick={()=>setMenuOpen(false)}>
        <nav style={{display:"flex",flexDirection:"column",gap:0,flex:1}}>
          {navLinks.map(([h,k],i)=><a key={h} href={h} onClick={()=>setMenuOpen(false)} style={{textDecoration:"none",padding:"1.05rem 0",borderBottom:`1px solid ${C.faint}`,display:"flex",alignItems:"center",gap:".7rem",WebkitTapHighlightColor:"transparent"}}>
            <span className="fm" style={{fontSize:"8px",color:C.teal,letterSpacing:".35em",minWidth:"24px"}}>0{i+1}</span>
            <span className="fm" style={{fontSize:"12px",letterSpacing:".2em",color:C.cream,textTransform:"uppercase"}}>{gt(k)}</span>
          </a>)}
        </nav>
        <div style={{paddingTop:"1.4rem",borderTop:`1px solid ${C.faint}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <LangSwitcher/>
          <span className="fd" style={{color:C.saffron,opacity:.35,fontSize:"1.4rem"}}>ॐ</span>
        </div>
      </div>}

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{minHeight:"100dvh",position:"relative",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",padding:mob?"7rem 1.25rem 5rem":"8rem 2rem 5rem",overflow:"hidden"}}>
        <MayaScene/><Sparks/>
        <div className="fd" aria-hidden="true" style={{position:"absolute",inset:0,zIndex:1,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",fontSize:"clamp(12rem,35vw,28rem)",color:C.saffron,opacity:.04,animation:"breathe 7s ease-in-out infinite",userSelect:"none"}}>ॐ</div>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"min(72vw,560px)",height:"min(72vw,560px)",borderRadius:"50%",border:"1px solid rgba(212,160,23,.1)",animation:"haloSpin 32s linear infinite",zIndex:1}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"min(55vw,440px)",height:"min(55vw,440px)",borderRadius:"50%",border:"1px solid rgba(204,85,119,.08)",animation:"haloSpinRev 22s linear infinite",zIndex:1}}/>

        <div style={{position:"relative",zIndex:2,maxWidth:"820px",width:"100%"}}>
          {/* Free community badge */}
          <div style={{display:"inline-flex",alignItems:"center",gap:".6rem",border:`1px solid ${C.faint}`,padding:".38rem 1rem",marginBottom:"1.4rem",animation:"revealIn 1.2s ease both"}}>
            <span style={{width:"6px",height:"6px",borderRadius:"50%",background:C.teal,animation:"breathe 2s ease-in-out infinite"}}/>
            <DT k="hero_lbl" className="fm" style={{fontSize:"9px",letterSpacing:".35em",color:C.teal,textTransform:"uppercase"}}/>
          </div>
          <h1 className="fc gold-shimmer" style={{fontSize:"clamp(3rem,14vw,10rem)",fontWeight:900,lineHeight:.87,letterSpacing:".09em",animation:"revealIn 1.2s ease .1s both",marginBottom:".4rem"}}>{gt("nav_brand")}</h1>
          <span className="fd" style={{fontSize:mob?"clamp(1rem,4.5vw,1.7rem)":"clamp(1rem,3.5vw,2rem)",color:C.saffron,opacity:.68,letterSpacing:".2em",display:"block",animation:"revealIn 1.2s ease .22s both",marginBottom:".7rem"}}>ज्ञान</span>
          <p className="fm" style={{fontSize:"clamp(.5rem,1.5vw,.76rem)",letterSpacing:".5em",color:C.cream,textTransform:"uppercase",animation:"revealIn 1.2s ease .34s both",marginBottom:"2rem",textShadow:`0 0 18px rgba(212,160,23,.4)`}}>Spirit &nbsp;·&nbsp; Mind &nbsp;·&nbsp; Machine</p>
          <div style={{animation:"revealIn 1.2s ease .46s both",marginBottom:"1.5rem"}}><span className="fd" style={{fontSize:"1.4rem",color:C.turmeric2,letterSpacing:".4em"}}>🪷 ॐ 🪷</span></div>
          <p className="fg" style={{fontSize:"clamp(.95rem,2.5vw,1.28rem)",fontStyle:"italic",color:C.cream,lineHeight:1.75,maxWidth:"640px",margin:"0 auto",marginBottom:mob?"2rem":"2.6rem",animation:"revealIn 1.2s ease .58s both"}}>{gt("hero_tag")}</p>
          <div className="cta-row" style={{animation:"revealIn 1.2s ease .7s both"}}>
            <a href="#join" className="btn-primary">{gt("btn_join")}</a>
            <a href="#why" className="btn-outline">{gt("btn_read")}</a>
          </div>
        </div>
        <div className="fd" style={{position:"absolute",bottom:"2rem",left:"50%",transform:"translateX(-50%)",fontSize:"1.7rem",color:C.saffron,zIndex:2,opacity:.42,animation:"floatY 2.5s ease-in-out infinite"}}>↓</div>
      </section>

      {/* ── WHY WE GATHER ─────────────────────────────────────── */}
      <section id="why" className="sec" style={{background:C.deep}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"650px",height:"650px",borderRadius:"50%",background:`radial-gradient(circle,rgba(232,101,10,.04),transparent 65%)`,pointerEvents:"none"}}/>
        <div className="inner">
          <Rev>
            <div style={{textAlign:"center",marginBottom:mob?"3rem":"5rem"}}>
              <DT k="why_pre" className="fm" style={{fontSize:"9px",letterSpacing:".45em",color:C.teal,textTransform:"uppercase",display:"block",marginBottom:".75rem"}}/>
              <h2 className="fc" style={{fontSize:"clamp(1.8rem,6vw,4rem)",fontWeight:900,color:C.parchment,letterSpacing:".1em",lineHeight:1.05}}>
                <DT k="why_title" as="span"/>
              </h2>
              <div style={{width:"50px",height:"1px",background:`linear-gradient(90deg,transparent,${C.saffron},transparent)`,margin:"1.4rem auto 0"}}/>
            </div>
          </Rev>

          <div className="grid-2" style={{marginBottom:mob?"3rem":"5rem"}}>
            <Rev dir={mob?"":"l"}>
              <div style={{position:"relative"}}>
                <div aria-hidden="true" style={{position:"absolute",top:"-1.5rem",left:"-0.8rem",fontFamily:"'Tiro Devanagari Hindi',serif",fontSize:"6rem",color:C.saffron,opacity:.06,userSelect:"none",lineHeight:1,pointerEvents:"none"}}>अ</div>
                <p className="fg" style={{fontSize:"clamp(1.05rem,2.5vw,1.2rem)",color:C.cream,lineHeight:1.96,marginBottom:"2rem",position:"relative",zIndex:1}}>{gt("why_p1")}</p>
                <VB sk={gt("why_v1_sk")} tr={gt("why_v1_tr")} src={gt("why_v1_src")} color={C.saffron}/>
              </div>
            </Rev>
            <Rev dir={mob?"":"r"}>
              <div style={{position:"relative"}}>
                <div aria-hidden="true" style={{position:"absolute",top:"-1.5rem",right:"-0.8rem",fontFamily:"'Tiro Devanagari Hindi',serif",fontSize:"6rem",color:C.turmeric,opacity:.06,userSelect:"none",lineHeight:1,pointerEvents:"none"}}>इ</div>
                <p className="fg" style={{fontSize:"clamp(1.05rem,2.5vw,1.2rem)",color:C.cream,lineHeight:1.96,marginBottom:"2rem",position:"relative",zIndex:1}}>{gt("why_p2")}</p>
                <VB sk={gt("why_v2_sk")} tr={gt("why_v2_tr")} src={gt("why_v2_src")} color={C.turmeric}/>
              </div>
            </Rev>
          </div>

          {/* Key message banner */}
          <Rev>
            <div style={{border:`1px solid ${C.faint}`,padding:mob?"1.6rem":"2.4rem",background:"rgba(6,6,26,.5)",backdropFilter:"blur(8px)",textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(232,101,10,.04),transparent 50%,rgba(204,85,119,.04))",pointerEvents:"none"}}/>
              <p className="fd" style={{fontSize:"clamp(1rem,2.8vw,1.35rem)",color:C.parchment,lineHeight:1.82,maxWidth:"700px",margin:"0 auto",position:"relative",zIndex:1}}>
                {lang==="ta"?"இது ஒரு வியாபாரம் அல்ல. இது ஒரு யாத்திரை. வெறும் பகிர்தல் கொண்டு — கேள்விகள், நுண்ணுணர்வுகள், ஒன்றாக ஆராய்வது — நாம் அனைவரும் இங்கே கூடுகிறோம்.":lang==="sa"?"इदं व्यापारः नहि। इयं यात्रा। केवलं भागिता — प्रश्नाः, अन्तर्दृष्टयः, सह-अन्वेषणं — वयं सर्वे अत्र मिलामः।":"This is not a business. It is a pilgrimage. Brought together only by sharing — questions, insights, collective exploration — we all meet here as equals."}
              </p>
            </div>
          </Rev>
        </div>
      </section>

      {/* ── THE CHARIOT ───────────────────────────────────────── */}
      <section id="chariot" className="sec" style={{background:C.night}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(ellipse at 50% 100%,rgba(212,160,23,.05),transparent 55%)`,pointerEvents:"none"}}/>
        <div className="inner">
          <Rev>
            <div style={{marginBottom:mob?"2.5rem":"3.5rem",maxWidth:"780px"}}>
              <DT k="rath_pre" className="fm" style={{fontSize:"9px",letterSpacing:".42em",color:C.teal,textTransform:"uppercase",display:"block",marginBottom:".65rem"}}/>
              <h2 className="fc" style={{fontSize:"clamp(1.6rem,5vw,3rem)",fontWeight:700,color:C.parchment,letterSpacing:".05em",marginBottom:".9rem"}}>
                <DT k="rath_title" as="span"/>
              </h2>
              <p className="fg" style={{fontSize:"clamp(1rem,2.5vw,1.18rem)",fontStyle:"italic",color:C.parchment,lineHeight:1.82,marginBottom:"1rem"}}>{gt("rath_intro")}</p>
              <p className="fg" style={{fontSize:"clamp(.95rem,2.2vw,1.08rem)",color:C.mist,lineHeight:1.88}}>{gt("rath_context")}</p>
            </div>
          </Rev>

          <div className="grid-2-asym">
            {/* Layered diagram */}
            <Rev delay={80}>
              <div>
                <p className="fm" style={{fontSize:"8px",letterSpacing:".35em",color:C.mist,textTransform:"uppercase",marginBottom:"1rem"}}>{gt("rath_lbl")}</p>
                {chariotLayers.map((lay,i)=>(
                  <div key={lay.key} className={`rath-row${activeLayer===i?" active":""}`}
                    style={{padding:mob?"1rem 1.1rem":"1.15rem 1.4rem",background:C.deep,cursor:"pointer"}}
                    onClick={()=>setActiveLayer(activeLayer===i?null:i)}>
                    <div style={{display:"flex",alignItems:"center",gap:mob?".85rem":"1.2rem",width:"100%"}}>
                      <span style={{fontSize:mob?"1.2rem":"1.4rem",flexShrink:0,color:lay.color,minWidth:"26px",textAlign:"center"}}>{lay.sym}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"baseline",gap:".55rem",flexWrap:"wrap"}}>
                          <DT k={lay.skK} className="fd" style={{fontSize:"clamp(.9rem,2.5vw,1.08rem)",color:lay.color,fontWeight:600}}/>
                          <span className="fm" style={{fontSize:"7.5px",letterSpacing:".16em",color:C.mist,textTransform:"uppercase"}}>{lay.tech}</span>
                        </div>
                        <div style={{overflow:"hidden",maxHeight:activeLayer===i?"200px":"0",transition:"max-height .4s cubic-bezier(.23,1,.32,1)"}}>
                          <DT k={lay.eK} as="p" className="fg" style={{fontSize:"clamp(.85rem,2vw,.96rem)",color:C.mist,lineHeight:1.75,marginTop:".35rem",paddingBottom:".2rem"}}/>
                        </div>
                      </div>
                      <span style={{color:C.faint,fontSize:".7rem",flexShrink:0,transform:activeLayer===i?"rotate(180deg)":"none",transition:"transform .3s"}}>▾</span>
                    </div>
                  </div>
                ))}
                <p className="fm" style={{fontSize:"8px",letterSpacing:".2em",color:C.faint,marginTop:".8rem",textAlign:"center",textTransform:"uppercase"}}>{mob?"Tap":"Click"} a layer to expand</p>
              </div>
            </Rev>

            {/* Verse + context */}
            <Rev delay={200}>
              <div style={{padding:mob?"1.6rem":"2.2rem",border:`1px solid ${C.faint}`,background:"rgba(6,6,26,.6)",backdropFilter:"blur(8px)",position:mob?"static":"sticky",top:"5.5rem"}}>
                <span className="fd" style={{fontSize:"2rem",color:C.saffron,display:"block",marginBottom:"1rem",animation:"floatY 4s ease-in-out infinite"}}>🛕</span>
                <p className="fg" style={{fontSize:"clamp(1rem,2.5vw,1.12rem)",fontStyle:"italic",color:C.parchment,lineHeight:1.88,marginBottom:"1.5rem"}}>{lang==="ta"?"இந்த உருவகம் ஆழமானது. 2,500 ஆண்டுகளுக்கு முன்பு எழுதப்பட்ட இது — எந்த ஸ்மார்ட்போன் கண்டுபிடிக்கப்படுவதற்கும் முன்பு — நோட்டிஃபிகேஷன்கள் மற்றும் அல்காரிதம்களுடன் மனிதன் ஏன் போராடுகிறான் என்பதை சரியாக விவரிக்கிறது.":lang==="sa"?"अयं उपमानः गहनः। सा २५०० वर्षपुरातना — स्मार्टफोन-आगमनात् पूर्वम् लिखिता — प्रतिवेदनैः अल्गोरिदमैश्च मानवस्य संघर्षं सटीकतया वर्णयति।":"This metaphor cuts deep. Written 2,500 years before any smartphone was invented, it describes with perfect precision why a human being struggles with notifications, algorithms and infinite scroll."}</p>
                <p className="fm" style={{fontSize:"8.5px",letterSpacing:".22em",color:C.mist,textTransform:"uppercase",marginBottom:"1rem"}}>{lang==="ta"?"கேள்வி:":lang==="sa"?"प्रश्नः:":"The question:"}</p>
                <p className="fg" style={{fontSize:"clamp(.95rem,2.2vw,1.08rem)",color:C.cream,lineHeight:1.88,fontStyle:"italic"}}>{lang==="ta"?"உங்கள் டிஜிட்டல் வாழ்க்கையில் சாரதி யார்? புத்தியா? அல்லது அல்காரிதமா?":lang==="sa"?"भवतः जालीयजीवने सारथिः कः? बुद्धिः? अथवा अल्गोरिदमः?":"In your digital life — who is the charioteer? Your buddhi? Or the algorithm?"}</p>
              </div>
            </Rev>
          </div>
        </div>
      </section>

      {/* ── THREE YOGAS ───────────────────────────────────────── */}
      <section id="yogas" className="sec" style={{background:C.deep,position:"relative"}}>
        <div style={{position:"absolute",bottom:"-60px",right:"-60px",width:"400px",height:"400px",borderRadius:"50%",background:C.lotus,filter:"blur(140px)",opacity:.05,pointerEvents:"none"}}/>
        <div className="inner">
          <Rev>
            <div style={{textAlign:"center",marginBottom:mob?"3rem":"4.5rem"}}>
              <DT k="yoga_pre" className="fm" style={{fontSize:"9px",letterSpacing:".42em",color:C.teal,textTransform:"uppercase",display:"block",marginBottom:".7rem"}}/>
              <h2 className="fc" style={{fontSize:"clamp(1.6rem,5vw,3rem)",fontWeight:700,color:C.parchment,letterSpacing:".05em",marginBottom:".9rem"}}>
                <DT k="yoga_title" as="span"/>
              </h2>
              <p className="fg" style={{fontSize:"clamp(.95rem,2.5vw,1.1rem)",fontStyle:"italic",color:C.mist,maxWidth:"600px",margin:"0 auto",lineHeight:1.88}}>{gt("yoga_intro")}</p>
            </div>
          </Rev>

          <div className="grid-3" style={{border:`1px solid ${C.faint}`}}>
            {yogas.map((y,i)=>(
              <Rev key={y.num} delay={mob?0:i*120}>
                <div className="yoga-panel" style={{padding:mob?"1.8rem 1.4rem":"2.8rem 2.2rem",borderRight:mob?"none":(i<2?`1px solid ${C.faint}`:"none"),borderBottom:mob&&i<2?`1px solid ${C.faint}`:"none",position:"relative",overflow:"hidden",height:"100%",transition:"background .4s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(6,6,26,.85)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div aria-hidden="true" style={{position:"absolute",bottom:"-1rem",right:"-0.5rem",fontFamily:"'Tiro Devanagari Hindi',serif",fontSize:"8rem",color:y.col,opacity:.04,lineHeight:1,userSelect:"none",pointerEvents:"none"}}>{i===0?"क":i===1?"ज":"भ"}</div>
                  <span className="fm" style={{fontSize:"8px",color:y.col,letterSpacing:".42em",display:"block",marginBottom:".9rem"}}>{y.num} / 03</span>
                  <span style={{fontSize:mob?"2.1rem":"2.6rem",display:"block",marginBottom:".8rem",animation:`floatY ${3.5+i*.55}s ease-in-out infinite`}}>{y.sym}</span>
                  <DT k={y.nK} className="fc" style={{fontSize:"clamp(1rem,3vw,1.35rem)",color:C.parchment,display:"block",marginBottom:".2rem",letterSpacing:".05em"}}/>
                  <DT k={y.subK} className="fm" style={{fontSize:"8px",letterSpacing:".25em",color:y.col,textTransform:"uppercase",display:"block",marginBottom:"1.4rem",opacity:.8}}/>
                  {/* verse */}
                  <div style={{borderLeft:`2px solid ${y.col}55`,paddingLeft:"1rem",marginBottom:"1.4rem"}}>
                    <DT k={y.skK} className="fd" style={{fontSize:"clamp(.82rem,2vw,.96rem)",color:y.col,display:"block",marginBottom:".3rem",lineHeight:1.6}}/>
                    <DT k={y.strK} className="fg" style={{fontSize:"clamp(.82rem,2vw,.9rem)",fontStyle:"italic",color:C.mist,lineHeight:1.6}}/>
                  </div>
                  <DT k={y.pK} as="p" className="fg" style={{fontSize:"clamp(.9rem,2.2vw,1.02rem)",color:C.mist,lineHeight:1.9,marginBottom:"1.4rem"}}/>
                  {/* who */}
                  <div style={{paddingTop:"1rem",borderTop:`1px solid ${C.faint}`}}>
                    <p className="fm" style={{fontSize:"8px",letterSpacing:".22em",color:C.faint,textTransform:"uppercase",marginBottom:".5rem"}}>{lang==="ta"?"யாருக்கானது:":lang==="sa"?"कस्मै:":"For:"}</p>
                    <DT k={y.whoK} className="fm" style={{fontSize:"9px",letterSpacing:".12em",color:C.cream,lineHeight:1.8}}/>
                  </div>
                </div>
              </Rev>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE SANGHA ────────────────────────────────────────── */}
      <section id="sangha" className="sec" style={{background:C.night}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(ellipse at 30% 50%,rgba(0,191,160,.04),transparent 55%),radial-gradient(ellipse at 70% 50%,rgba(204,85,119,.04),transparent 55%)`,pointerEvents:"none"}}/>
        <div className="inner">
          <Rev>
            <div style={{textAlign:"center",marginBottom:mob?"3rem":"4.5rem"}}>
              <Cap num="03" deva="सङ्घः" en="The Sangha"/>
              <h2 className="fc" style={{fontSize:"clamp(1.6rem,5vw,3rem)",fontWeight:700,color:C.parchment,letterSpacing:".05em",marginBottom:"1rem"}}>
                <DT k="sangha_title" as="span"/>
              </h2>
              <p className="fg" style={{fontSize:"clamp(.95rem,2.5vw,1.12rem)",color:C.mist,maxWidth:"620px",margin:"0 auto",lineHeight:1.9}}>{gt("sangha_intro")}</p>
            </div>
          </Rev>

          <div className="grid-circles">
            {circles.map((c,i)=>(
              <Rev key={c.num} delay={mob?0:i*90}>
                <div className="circle-card" style={{background:i%2===0?C.deep:C.night}}>
                  <div className="circle-card-inner">
                    {/* Color accent top bar */}
                    <div style={{height:"2px",background:`linear-gradient(90deg,${c.col},transparent)`,marginBottom:".3rem",borderRadius:"1px"}}/>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"1rem"}}>
                      <DT k={c.iK} style={{fontSize:"1.9rem",animation:`floatY ${3.5+i*.4}s ease-in-out infinite`,display:"block"}}/>
                      <span className="fm" style={{fontSize:"8px",color:C.faint,letterSpacing:".28em"}}>{c.num}</span>
                    </div>
                    <DT k={c.nK} className="fc" style={{fontSize:"clamp(1rem,3vw,1.3rem)",color:C.parchment,display:"block",letterSpacing:".04em"}}/>
                    <DT k={c.subK} className="fm" style={{fontSize:"8px",letterSpacing:".24em",color:c.col,textTransform:"uppercase",display:"block",opacity:.85}}/>
                    <DT k={c.dK} as="p" className="fg" style={{fontSize:"clamp(.9rem,2.2vw,1.02rem)",color:C.mist,lineHeight:1.9,flex:1}}/>
                    {/* Free badge */}
                    <div style={{display:"flex",flexWrap:"wrap",gap:".4rem",marginTop:".5rem"}}>
                      {g(c.tK,lang).split(" · ").map((tag,ti)=>(
                        <span key={ti} className="fm" style={{fontSize:"8px",letterSpacing:".14em",textTransform:"uppercase",padding:".25rem .65rem",border:`1px solid ${c.col}44`,color:C.cream}}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Rev>
            ))}
          </div>

          {/* Open source declaration */}
          <Rev delay={120}>
            <div style={{marginTop:"3rem",textAlign:"center",padding:mob?"1.5rem":"2rem",border:`1px solid ${C.faint}`,background:"rgba(6,6,26,.4)"}}>
              <span className="fd" style={{fontSize:"1.5rem",color:C.teal,display:"block",marginBottom:".7rem"}}>∞</span>
              <p className="fg" style={{fontSize:"clamp(1rem,2.5vw,1.15rem)",color:C.cream,lineHeight:1.9,maxWidth:"600px",margin:"0 auto"}}>
                {lang==="ta"?"இங்கே உள்ள எல்லாமே — ஆவணகங்கள், திட்டங்கள், மென்பொருள் — திறந்த மூல மற்றும் முற்றிலும் இலவசம். உருவாக்கப்படுவதற்காக மட்டுமே, பகிர்வதற்காக மட்டுமே.":lang==="sa"?"अत्र सर्वम् — ग्रन्थागाराः, प्रकल्पाः, तन्त्रांशः — मुक्तस्रोतम् अस्ति, निःशुल्कम् च। केवलं निर्माणाय, केवलं भागितायै।":"Everything here — the archives, the projects, the software — is open-source and completely free. Built only to be shared. Shared only to build more."}
              </p>
            </div>
          </Rev>
        </div>
      </section>

      {/* ── MAHAVAKYAS ─────────────────────────────────────────── */}
      <section className="sec" style={{background:C.deep,position:"relative"}}>
        <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
          <div className="fd" aria-hidden="true" style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:"clamp(8rem,22vw,18rem)",color:C.saffron,opacity:.022,userSelect:"none",whiteSpace:"nowrap"}}>महावाक्य</div>
          {[[0,C.faint,"haloSpin 120s linear infinite"],[1,`rgba(232,101,10,.04)`,"haloSpinRev 90s linear infinite"]].map(([i,c,a])=>(
            <div key={i} style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:i===0?"140vw":"100vw",height:i===0?"140vw":"100vw",borderRadius:"50%",border:`1px solid ${c}`,animation:a}}/>
          ))}
        </div>
        <div className="inner" style={{position:"relative",zIndex:1}}>
          <Rev>
            <div style={{textAlign:"center",marginBottom:mob?"3rem":"4.5rem"}}>
              <DT k="maha_pre" className="fm" style={{fontSize:"9px",letterSpacing:".42em",color:C.teal,textTransform:"uppercase",display:"block",marginBottom:".7rem"}}/>
              <h2 className="fc" style={{fontSize:"clamp(1.6rem,5vw,3rem)",fontWeight:700,color:C.parchment,letterSpacing:".05em",marginBottom:".9rem"}}>
                <DT k="maha_title" as="span"/>
              </h2>
              <p className="fg" style={{fontSize:"clamp(.95rem,2.5vw,1.1rem)",fontStyle:"italic",color:C.mist,maxWidth:"520px",margin:"0 auto",lineHeight:1.88}}>{gt("maha_intro")}</p>
            </div>
          </Rev>

          <div className="grid-maha">
            {mahavakyas.map((mv,i)=>(
              <Rev key={mv.num} delay={mob?0:i*100}>
                <div className="mv-card" style={{background:i%2===0?C.night:C.deep,borderBottom:i<2?`1px solid ${C.faint}`:"1px solid #2A2820",borderRight:i%2===0&&!mob?`1px solid ${C.faint}`:"1px solid #2A2820"}}>
                  <div style={{position:"absolute",top:0,bottom:0,left:0,width:"2px",background:`linear-gradient(to bottom,transparent,${mv.col},transparent)`,opacity:.9}}/>
                  <div style={{paddingLeft:"1.3rem"}}>
                    <div style={{display:"flex",alignItems:"center",gap:".9rem",marginBottom:"1.2rem"}}>
                      <span className="fm" style={{fontSize:"8px",letterSpacing:".35em",color:mv.col,textTransform:"uppercase"}}>{mv.veda}</span>
                      <div style={{flex:1,height:"1px",background:`linear-gradient(90deg,${mv.col}44,transparent)`}}/>
                      <span className="fm" style={{fontSize:"8px",letterSpacing:".18em",color:C.faint}}>{mv.num}</span>
                    </div>
                    <DT k={mv.skK} className="fd" style={{fontSize:"clamp(1.3rem,4vw,2.1rem)",color:mv.col,display:"block",marginBottom:".65rem",lineHeight:1.2,animation:"verseGlow 5s ease-in-out infinite"}}/>
                    <DT k={mv.srcK} className="fm" style={{fontSize:"8px",letterSpacing:".22em",color:C.mist,textTransform:"uppercase",display:"block",marginBottom:"1.1rem"}}/>
                    <DT k={mv.trK} as="p" className="fg" style={{fontSize:"clamp(.9rem,2.2vw,1.02rem)",color:C.cream,lineHeight:1.92}}/>
                  </div>
                </div>
              </Rev>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOIN ────────────────────────────────────────────────── */}
      <section id="join" className="sec" style={{background:"#020208",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"500px",height:"1px",background:`linear-gradient(90deg,transparent,${C.saffron},transparent)`}}/>
        <div style={{position:"absolute",bottom:"-60px",left:"50%",transform:"translateX(-50%)",width:"500px",height:"500px",borderRadius:"50%",background:`radial-gradient(circle,rgba(0,191,160,.06),transparent 65%)`,pointerEvents:"none"}}/>
        <div className="inner" style={{position:"relative",zIndex:1}}>
          <Rev>
            <div style={{textAlign:"center",marginBottom:mob?"3rem":"4rem"}}>
              <DT k="join_pre" className="fm" style={{fontSize:"9px",letterSpacing:".45em",color:C.teal,textTransform:"uppercase",display:"block",marginBottom:".7rem"}}/>
              <span style={{fontSize:"clamp(2.5rem,8vw,4rem)",display:"block",marginBottom:".9rem",animation:"floatY 5s ease-in-out infinite"}}>🙏</span>
              <h2 className="fc" style={{fontSize:"clamp(1.8rem,6vw,3.8rem)",fontWeight:900,color:C.parchment,letterSpacing:".1em",lineHeight:1.05,marginBottom:"1.2rem"}}>
                <DT k="join_title" as="span"/>
              </h2>
              <p className="fg" style={{fontSize:"clamp(1rem,2.5vw,1.2rem)",color:C.mist,maxWidth:"580px",margin:"0 auto",lineHeight:1.96,marginBottom:"2.5rem"}}>{gt("join_p")}</p>
              <div className="cta-row" style={{marginBottom:"1.2rem"}}>
                <a href="#" className="btn-primary" style={{fontSize:"12px",padding:"1.1rem 2.8rem"}}>{gt("join_btn")}</a>
              </div>
              <p className="fm" style={{fontSize:"9px",letterSpacing:".28em",color:C.teal,textTransform:"uppercase"}}>{gt("join_free")}</p>
            </div>
          </Rev>

          {/* Contact links */}
          <Rev delay={120}>
            <div style={{display:"flex",gap:mob?"1.1rem":"1.8rem",justifyContent:"center",flexWrap:"wrap",marginBottom:mob?"3rem":"4rem"}}>
              {[["📨","Email","jnana@domain.com"],["🪷","Newsletter","Weekly Satsang"],["💬","Discord","Join the Forum"],["🐙","GitHub","Open Source"]].map(([icon,l,sub])=>(
                <a href="#" key={l} style={{textDecoration:"none",display:"flex",alignItems:"center",gap:".8rem",padding:mob?".8rem 1.1rem":".9rem 1.6rem",border:`1px solid ${C.faint}`,background:"rgba(255,255,255,.02)",transition:"all .28s",WebkitTapHighlightColor:"transparent"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.background="rgba(0,191,160,.05)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.faint;e.currentTarget.style.background="rgba(255,255,255,.02)"}}>
                  <span style={{fontSize:mob?"1.2rem":"1.4rem"}}>{icon}</span>
                  <div>
                    <span className="fm" style={{display:"block",fontSize:"9px",letterSpacing:".18em",color:C.cream,textTransform:"uppercase"}}>{l}</span>
                    <span className="fd" style={{fontSize:".85rem",color:C.turmeric2}}>{sub}</span>
                  </div>
                </a>
              ))}
            </div>
          </Rev>

          {/* Closing verse */}
          <Rev delay={200}>
            <div style={{textAlign:"center",maxWidth:"540px",margin:"0 auto",padding:mob?"2rem 0":"2.5rem 0",borderTop:`1px solid ${C.faint}`}}>
              <span className="fd" style={{fontSize:"clamp(1.5rem,4vw,2.2rem)",color:C.turmeric,display:"block",marginBottom:".8rem",animation:"verseGlow 5s ease-in-out infinite"}}>{gt("join_verse_sk")}</span>
              <p className="fg" style={{fontSize:"clamp(1rem,2.5vw,1.18rem)",fontStyle:"italic",color:C.cream,marginBottom:".5rem"}}>{gt("join_verse_tr")}</p>
              <p className="fm" style={{fontSize:"8px",letterSpacing:".22em",color:C.mist,textTransform:"uppercase"}}>{gt("join_verse_src")}</p>
            </div>
          </Rev>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer style={{borderTop:`1px solid ${C.faint}`,padding:mob?"1.3rem 1.25rem":"1.7rem 2.5rem",display:"flex",flexDirection:mob?"column":"row",justifyContent:"space-between",alignItems:mob?"flex-start":"center",gap:".8rem",background:C.deep}}>
        <div style={{display:"flex",alignItems:"center",gap:".5rem"}}>
          <span className="fd" style={{fontSize:"1.2rem",color:C.saffron}}>ॐ</span>
          <span className="fc" style={{fontSize:".78rem",color:C.turmeric2,letterSpacing:".1em"}}>{gt("nav_brand")}</span>
          <span className="fm" style={{fontSize:"7.5px",color:C.faint,letterSpacing:".14em"}}>&nbsp;·&nbsp; <DT k="footer_tag" as="span"/></span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
          <LangSwitcher/>
          <span className="fm" style={{fontSize:"8px",letterSpacing:".16em",color:C.faint}}>सत्यमेव जयते · Always free · Open community</span>
        </div>
      </footer>
    </div>
    </LangCtx.Provider>
  )
}