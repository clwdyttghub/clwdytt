export const CATEGORIES = [
  { id: 'notepad-category', title: 'Notepad', desc: 'Notes & Checklists' },
  { id: 'pdf-category', title: 'Documents', desc: 'PDFs & Forms' },
  { id: 'text-category', title: 'Text', desc: 'Quick Access Data' },
  { id: 'image-category', title: 'Photos', desc: 'ID Gallery' },
  { id: 'playstore-apps', title: 'App Directory', desc: 'Playstore Links' },
  { id: 'playstore-games', title: 'Game Library', desc: 'RPGs & Shooters' },
  { id: 'web-tools', title: 'Web Tools', desc: 'Editors & Hosting' },
  { id: 'pc-automation', title: 'Scripts', desc: 'PC Automations' },
  { id: 'cloud-storage', title: 'Mod Apps', desc: 'Modded APKs' },
  { id: 'app-download', title: 'Apk Version', desc: 'MEGA Link' }
];

export const SEED_DATA = [
  // NOTEPAD & LISTS
  {
    category: 'notepad-category',
    title: 'Welcome Note',
    subtitle: 'Read Me',
    type: 'note',
    content: 'Welcome to your new Archive Notepad! You can edit this note anytime.',
    order_index: 0
  },
  {
    category: 'notepad-category',
    title: 'Project Tasks',
    subtitle: 'To-Do',
    type: 'list',
    content: JSON.stringify(["Copy/paste", "Task Name", "Status"]),
    group_data: [
      { id: "1", checked: true, cells: ["Task-001", "Setup Offline Files", "Done"] },
      { id: "2", checked: false, cells: ["Task-002", "Build APK", "Pending"] }
    ],
    order_index: 1
  },
  {
    category: 'notepad-category',
    title: 'some stuff useful probably',
    subtitle: 'Function',
    type: 'list',
    content: JSON.stringify(["Copy/paste", "Function"]),
    group_data: [
      { id: "1783039150398", checked: false, cells: ["https://gemini.google.com/gems/create", "if gemini is not working"] }
    ],
    order_index: 2
  },
  {
    category: 'notepad-category',
    title: 'Genshin Accounts',
    subtitle: 'Database',
    type: 'list',
    content: JSON.stringify(["Account", "Level", "Characters"]),
    group_data: [
      { id: "g1", checked: false, cells: ["jnzotkr", "", "Varesa"] },
      { id: "g2", checked: false, cells: ["Claudei", "", ""] },
      { id: "g3", checked: false, cells: ["Claudeii", "", ""] },
      { id: "g4", checked: false, cells: ["seiatsuudan", "", ""] },
      { id: "g5", checked: false, cells: ["aibotno00.1", "11", "mona"] },
      { id: "g6", checked: false, cells: ["a.ibotno002", "16", ""] },
      { id: "g7", checked: false, cells: ["aibotno0.03", "11", ""] },
      { id: "g8", checked: false, cells: ["aibotn.o005", "14", "tignari"] },
      { id: "g9", checked: false, cells: ["aibotno.007", "25", "furina"] },
      { id: "g10", checked: false, cells: ["a.i.botno007", "25", "keqingdiluc"] },
      { id: "g11", checked: false, cells: ["kriznomanz", "018", "mavuika"] },
      { id: "g12", checked: false, cells: ["13", "", ""] },
      { id: "g13", checked: false, cells: ["aib", "", ""] },
      { id: "g14", checked: false, cells: ["14", "", ""] },
      { id: "g15", checked: false, cells: ["aibo", "none", ""] },
      { id: "g16", checked: false, cells: ["aibot", "", ""] },
      { id: "g17", checked: false, cells: ["aibotno01", "", ""] },
      { id: "g18", checked: true, cells: ["aibotno001", "5", ""] },
      { id: "g19", checked: true, cells: ["a.ibotno001", "5", ""] },
      { id: "g20", checked: true, cells: ["ai.botno001", "5", ""] },
      { id: "g21", checked: true, cells: ["aib.otno001", "6", ""] },
      { id: "g22", checked: true, cells: ["aibo.tno001", "6", ""] },
      { id: "g23", checked: true, cells: ["aibotn.o001", "5", ""] },
      { id: "g24", checked: false, cells: ["aibotno.001", "5", ""] },
      { id: "g25", checked: false, cells: ["aibotno0.01", "5", ""] },
      { id: "g26", checked: false, cells: ["aibotno00.1", "11", "mona"] },
      { id: "g27", checked: false, cells: ["aibotno002", "5", ""] },
      { id: "g28", checked: false, cells: ["a.ibotno002", "16", ""] },
      { id: "g29", checked: false, cells: ["aibotno003", "5", ""] },
      { id: "g30", checked: false, cells: ["a.ibotno003", "5", ""] },
      { id: "g31", checked: false, cells: ["ai.botno003", "5", ""] },
      { id: "g32", checked: false, cells: ["aib.otno003", "5", ""] },
      { id: "g33", checked: false, cells: ["aibo.tno003", "5", ""] },
      { id: "g34", checked: false, cells: ["aibot.no003", "5", ""] },
      { id: "g35", checked: false, cells: ["aibotn.o003", "5", ""] },
      { id: "g36", checked: false, cells: ["aibotno.003", "5", ""] },
      { id: "g37", checked: false, cells: ["aibotno0.03", "11", ""] },
      { id: "g38", checked: false, cells: ["aibotno00.3", "5", ""] },
      { id: "g39", checked: false, cells: ["a.i.botno003", "5", ""] },
      { id: "g40", checked: false, cells: ["a.i.b.otno003", "5", ""] },
      { id: "g41", checked: false, cells: ["a.i.b.o.tno003", "9", ""] },
      { id: "g42", checked: false, cells: ["a.i.b.o.t.no003", "5", ""] },
      { id: "g43", checked: false, cells: ["a.i.b.o.t.n.o003", "6", ""] },
      { id: "g44", checked: false, cells: ["a.i.b.o.t.n.o.003", "5", ""] },
      { id: "g45", checked: false, cells: ["a.i.b.o.t.n.o.0.03", "5", ""] },
      { id: "g46", checked: false, cells: ["a.i.b.o.t.n.o.0.0.3", "5", ""] },
      { id: "g47", checked: false, cells: ["aibotno004", "", ""] },
      { id: "g48", checked: false, cells: ["a.ibotno004", "5", ""] },
      { id: "g49", checked: false, cells: ["ai.botno004", "5", ""] },
      { id: "g50", checked: false, cells: ["aib.otno004", "5", ""] },
      { id: "g51", checked: false, cells: ["aibo.tno004", "5", ""] },
      { id: "g52", checked: false, cells: ["aibot.no004", "5", ""] },
      { id: "g53", checked: false, cells: ["aibotn.o004", "5", ""] },
      { id: "g54", checked: false, cells: ["aibotno.004", "5", ""] },
      { id: "g55", checked: false, cells: ["aibotno0.04", "5", ""] },
      { id: "g56", checked: false, cells: ["aibotno00.4", "none", ""] },
      { id: "g57", checked: false, cells: ["a.i.botno004", "5", ""] },
      { id: "g58", checked: false, cells: ["a.i.b.otno004", "", ""] },
      { id: "g59", checked: false, cells: ["a.i.b.o.tno004", "", ""] },
      { id: "g60", checked: false, cells: ["a.i.b.o.t.no004", "", ""] },
      { id: "g61", checked: false, cells: ["a.i.b.o.t.n.o004", "", ""] },
      { id: "g62", checked: false, cells: ["a.i.b.o.t.n.o.004", "", ""] },
      { id: "g63", checked: false, cells: ["a.i.b.o.t.n.o.0.04", "", ""] },
      { id: "g64", checked: false, cells: ["a.i.b.o.t.n.o.0.0.4", "", ""] },
      { id: "g65", checked: false, cells: ["ai.botno005", "5", "keqing"] },
      { id: "g66", checked: false, cells: ["aibot.no005", "5", ""] },
      { id: "g67", checked: false, cells: ["aibotn.o005", "14", "tignari"] },
      { id: "g68", checked: false, cells: ["aibotno006", "5", "mona"] },
      { id: "g69", checked: false, cells: ["a.i.b.otno006", "5", ""] },
      { id: "g70", checked: false, cells: ["a.ibotno007", "5", "mona"] },
      { id: "g71", checked: false, cells: ["ai.botno007", "", "skywardblade"] },
      { id: "g72", checked: false, cells: ["aibotno.007", "25", "furina"] },
      { id: "g73", checked: false, cells: ["aibotno0.07", "5", "furina"] },
      { id: "g74", checked: false, cells: ["aibotn.o007", "", "mona"] },
      { id: "g75", checked: false, cells: ["aibotno00.7", "", "Wriothesley"] },
      { id: "g76", checked: false, cells: ["a.i.botno007", "25", "keqingdiluc"] }
    ],
    order_index: 3
  },
  // DOCUMENTS
  { category: 'pdf-category', title: 'COVID Vac', subtitle: 'Vaccination Record', type: 'pdf', content: 'assets/PDF - Vaccination Claudette.pdf', order_index: 0 },
  { category: 'pdf-category', title: 'Resume', subtitle: 'My CV', type: 'pdf', content: 'assets/Claudette CV.pdf', order_index: 1 },
  { category: 'pdf-category', title: 'OR & CR', subtitle: 'MIO Gravis', type: 'pdf', content: 'assets/Cajilig OR-CR.pdf', order_index: 2 },
  { category: 'pdf-category', title: 'TIN ID', subtitle: 'Digital TIN ID', type: 'pdf', content: 'assets/PDF - Digital TinID Cajilig.pdf', order_index: 3 },

  // TEXT SNIPPETS
  {
    category: 'text-category',
    title: 'VS Code commands',
    subtitle: 'Commands',
    type: 'text_group',
    group_data: [
      { label: "PATH & RUN NODE", value: "cd app/src/main/assets; node server.js" },
      { label: "Clear APK", value: ".\\gradlew clean" },
      { label: "Build APK", value: ".\\gradlew assembleDebug" }
    ],
    order_index: 0
  },
  {
    category: 'text-category',
    title: "Me's Information",
    subtitle: 'Personal Details',
    type: 'text_group',
    group_data: [
      { label: "Contact (DITO)", value: "09913248406" },
      { label: "Contact (TNT)", value: "09641533069" },
      { label: "DITO Wifi Password", value: "k9rt4nvnek4" }
    ],
    order_index: 1
  },
  {
    category: 'text-category',
    title: 'Emails & Addresses',
    subtitle: 'Multiple Accounts',
    type: 'text_group',
    group_data: [
      { label: "Personal Email", value: "claudettecajilig@gmail.com" },
      { label: "2nd Personal Email", value: "claudecajilig@gmail.com" },
      { label: "School Email", value: "cajilig.346826@marikina.sti.edu.ph" }
    ],
    order_index: 2
  },
  {
    category: 'text-category',
    title: 'Passwords',
    subtitle: 'Security',
    type: 'text_group',
    group_data: [
      { label: "pass1", value: "Claudette4955!" }, { label: "pass2", value: "Claudette4955" },
      { label: "pass3", value: "Bernal4955!" }, { label: "pass4", value: "Bernal4955" },
      { label: "pass5", value: "Claude4955!" }, { label: "pass6", value: "Claude4955" },
      { label: "pass7", value: "Gyll4955!" }, { label: "pass8", value: "Gyll4955" },
      { label: "pass9", value: "Claudette292004!" }, { label: "pass10", value: "Claudette292004" },
      { label: "pass11", value: "Bernal292004!" }, { label: "pass12", value: "Bernal292004" },
      { label: "pass13", value: "Claude292004!" }, { label: "pass14", value: "Claude292004" },
      { label: "pass15", value: "Gyll292004!" }, { label: "pass16", value: "Gyll292004" }
    ],
    order_index: 3
  },
  {
    category: 'text-category',
    title: "Mother's Information",
    subtitle: 'Personal Details',
    type: 'text_group',
    group_data: [
      { label: "Maiden name", value: "Editha Berras Bernal" },
      { label: "Name", value: "Editha Bernal Cajilig" },
      { label: "Birth date", value: "October 16, 1971" },
      { label: "Civil status", value: "Widowed" },
      { label: "Educational Attainment", value: "Bachelor degree with masteral units college" },
      { label: "Nationality", value: "Filipino" },
      { label: "Contact no", value: "09927504650" },
      { label: "GCash", value: "0966 332 0089" },
      { label: "Email", value: "edith.b.bernal@gmail.com" },
      { label: "Occupation", value: "Teacher" },
      { label: "Motor MV File", value: "130100000170021" },
      { label: "Motor Plate", value: "NC88247" }
    ],
    order_index: 4
  },
  {
    category: 'text-category',
    title: "Father's Information",
    subtitle: 'Personal Details',
    type: 'text_group',
    group_data: [
      { label: "Name", value: "Rogelio Paez Cajilig" },
      { label: "Birth date", value: "February 3, 1970" },
      { label: "Nationality", value: "Filipino" }
    ],
    order_index: 5
  },
  {
    category: 'text-category',
    title: "Sister's Information",
    subtitle: 'Personal Details',
    type: 'text_group',
    group_data: [
      { label: "Name", value: "Hannah Geremaica Bernal Cajilig" },
      { label: "Birth date", value: "December 14, 1997" },
      { label: "Educational Attainment", value: "Bachelor degree" },
      { label: "Nationality", value: "Filipino" },
      { label: "Contact no", value: "09927504650" }
    ],
    order_index: 6
  },
  {
    category: 'text-category',
    title: "Brother's Information",
    subtitle: 'Personal Details',
    type: 'text_group',
    group_data: [
      { label: "Name", value: "Chester Glenn Bernal Cajilig" },
      { label: "Birth date", value: "December 14, 1997" }
    ],
    order_index: 7
  },
  {
    category: 'text-category',
    title: "Loloves Information",
    subtitle: 'Personal Details',
    type: 'text_group',
    group_data: [
      { label: "Name", value: "James Carl Daliva" },
      { label: "Birth date", value: "September 30, 2002" },
      { label: "Contact (TNT)", value: "09635210637" }
    ],
    order_index: 8
  },
  {
    category: 'text-category',
    title: "Usernames & Profiles",
    subtitle: 'System Handles',
    type: 'text_group',
    group_data: [
      { label: "GitHub Handle", value: "clwdyttghub" },
      { label: "Steam", value: "clwdyttsteam" },
      { label: "Valorant", value: "clwdyttriot" },
      { label: "Genshin1", value: "seiatsuudan" }
    ],
    order_index: 9
  },
  {
    category: 'text-category',
    title: "AI Prompts?",
    subtitle: 'SOME ALREADY MADE PROMPTS',
    type: 'text_group',
    group_data: [
      {
        label: "CHANGE CODE",
        value: "WHEN I REQUEST A CHANGE IN STYLE, I MEAN A TOTAL, COMPLETE REDESIGN OF THE STYLE TO MATCH MY INSTRUCTIONS PERFECTLY. BE CREATIVE AND PROFESSIONAL THE DESIGN SHOULD LOOK AND FEEL LIKE IT WAS BUILT ENTIRELY ACCORDING TO THAT SPECIFIC STYLE FROM THE START.\n\nENSURE THAT THE FINAL RESULT IS FULLY OPTIMIZED TO BE BOTH ANDROID MOBILE APPLICATION FRIENDLY AND WEB FORM APPLICATION FRIENDLY. IT MUST BE FULLY RESPONSIVE AND FUNCTIONAL ACROSS ALL PLATFORMS.\n\nPLEASE PROVIDE THE COMPLETE, UPDATED, AND FULLY FUNCTIONAL VERSION OF THE ENTIRE FILE. IT IS CRITICAL THAT YOU INCLUDE EVERY SINGLE ORIGINAL ELEMENT FROM THE PREVIOUS VERSION. DO NOT TRUNCATE, SUMMARIZE, OR OMIT ANY CONTENT, CATEGORIES, TEXT LISTS, OR LOGIC STRUCTURES. THE FINAL OUTPUT MUST BE THE ENTIRE CODEBASE IN FULL, READY TO REPLACE THE CURRENT VERSION WITHOUT LOSING ANY DATA."
      }
    ],
    order_index: 10
  },

  // IMAGES
  {
    category: 'image-category',
    title: 'Vaccination Card Files',
    subtitle: 'Front & Back',
    type: 'image_group',
    group_data: [
      { label: "FRONT SIDE - Vaccination Card", url: "assets/PIC - FRONT Vaccination Claudette.jpg" },
      { label: "BACK SIDE - Vaccination Card", url: "assets/PIC - BACK Vaccination Claudette.jpg" }
    ],
    order_index: 0
  },
  {
    category: 'image-category',
    title: "Driver's License Files",
    subtitle: 'Front & Back',
    type: 'image_group',
    group_data: [
      { label: "FRONT SIDE - Driver's License", url: "assets/PIC - Front Driver License.jpg" },
      { label: "BACK SIDE - Driver's License", url: "assets/PIC - Back Driver License.jpg" },
      { label: "Full ID - Driver's License", url: "assets/PIC - Driver License.jpg" }
    ],
    order_index: 1
  },
  {
    category: 'image-category',
    title: 'Digital TIN ID',
    subtitle: 'View Picture',
    type: 'image_group',
    group_data: [{ label: "Digital TIN ID", url: "assets/PIC - Digital TinID Cajilig.jpg" }],
    order_index: 2
  },
  {
    category: 'image-category',
    title: 'ID 1x1',
    subtitle: 'Picture',
    type: 'image_group',
    group_data: [{ label: "ID 1x1", url: "assets/PIC - ID 1x1.png" }],
    order_index: 3
  },
  {
    category: 'image-category',
    title: 'Signature PNG',
    subtitle: 'PNG File',
    type: 'image_group',
    group_data: [{ label: "Signature PNG", url: "assets/PNG - Signature Claudette.png" }],
    order_index: 4
  },
  {
    category: 'image-category',
    title: 'Parent Signatures',
    subtitle: 'PNG & JPG',
    type: 'image_group',
    group_data: [
      { label: "Signature Clean (PNG)", url: "assets/PNG - Parent Signature.png" },
      { label: "Signature Document (JPG)", url: "assets/PIC - Parent Signature.jpeg" },
      { label: "Signature & Name Document (JPEG)", url: "assets/PIC - Parent Signature & Name.jpeg" }
    ],
    order_index: 5
  },
  {
    category: 'image-category',
    title: 'OR & CR Files',
    subtitle: 'Photos',
    type: 'image_group',
    group_data: [
      { label: "CR Photo", url: "assets/CR-CAJILIG.jpg" },
      { label: "OR Photo", url: "assets/OR-CAJILIG.jpg" }
    ],
    order_index: 6
  },

  // PLAYSTORE APPS
  { category: 'playstore-apps', title: 'MEGA', subtitle: 'Cloud', type: 'link', content: 'https://play.google.com/store/apps/details?id=mega.privacy.android.app', order_index: 0 },
  { category: 'playstore-apps', title: 'TikTok', subtitle: 'Video', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.ss.android.ugc.trill', order_index: 1 },
  { category: 'playstore-apps', title: 'Shopee', subtitle: 'Shop', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.shopee.ph', order_index: 2 },
  { category: 'playstore-apps', title: 'Spotify', subtitle: 'Music', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.spotify.music', order_index: 3 },
  { category: 'playstore-apps', title: 'Gemini', subtitle: 'AI', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.google.android.apps.bard', order_index: 4 },
  { category: 'playstore-apps', title: 'GCash', subtitle: 'Wallet', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.globe.gcash.android', order_index: 5 },
  { category: 'playstore-apps', title: 'Waze', subtitle: 'Nav', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.waze', order_index: 6 },
  { category: 'playstore-apps', title: 'Lalamove', subtitle: 'Delivery', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.lalamove.global.driver.sea', order_index: 7 },
  { category: 'playstore-apps', title: 'Facebook', subtitle: 'Social', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.facebook.katana', order_index: 8 },
  { category: 'playstore-apps', title: 'Messenger', subtitle: 'Chat', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.facebook.orca', order_index: 9 },
  { category: 'playstore-apps', title: 'Instagram', subtitle: 'Reels', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.instagram.android', order_index: 10 },
  { category: 'playstore-apps', title: 'MS Auth', subtitle: 'Security', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.azure.authenticator', order_index: 11 },
  { category: 'playstore-apps', title: 'Life360', subtitle: 'Tracking', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.life360.android.safetymapd', order_index: 12 },
  { category: 'playstore-apps', title: 'McDo', subtitle: 'Food', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.mcdonalds.mobileapp', order_index: 13 },
  { category: 'playstore-apps', title: 'DITO', subtitle: 'Telecom', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.mydito', order_index: 14 },
  { category: 'playstore-apps', title: 'Keep', subtitle: 'Notes', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.google.android.keep', order_index: 15 },
  { category: 'playstore-apps', title: 'Brave', subtitle: 'Browser', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.brave.browser', order_index: 16 },
  { category: 'playstore-apps', title: 'Discord', subtitle: 'Chat', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.discord', order_index: 17 },
  { category: 'playstore-apps', title: 'Canva', subtitle: 'Design', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.canva.editor', order_index: 18 },
  { category: 'playstore-apps', title: 'Teams', subtitle: 'Work Comms', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.microsoft.teams', order_index: 19 },
  { category: 'playstore-apps', title: 'OneDrive', subtitle: 'Storage', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.microsoft.skydrive', order_index: 20 },
  { category: 'playstore-apps', title: 'Grab', subtitle: 'Ride', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.grabtaxi.passenger', order_index: 21 },
  { category: 'playstore-apps', title: 'LinkedIn', subtitle: 'Network', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.linkedin.android', order_index: 22 },
  { category: 'playstore-apps', title: 'Angkas', subtitle: 'Ride', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.angkas.customer', order_index: 23 },
  { category: 'playstore-apps', title: 'Move It', subtitle: 'Ride', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.moveit.app.customer', order_index: 24 },
  { category: 'playstore-apps', title: 'Maya', subtitle: 'Bank', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.paymaya', order_index: 25 },
  { category: 'playstore-apps', title: 'Netflix', subtitle: 'Movies', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.netflix.mediaclient', order_index: 26 },
  { category: 'playstore-apps', title: 'foodpanda', subtitle: 'Food', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.global.foodpanda.android', order_index: 27 },
  { category: 'playstore-apps', title: 'GoTyme', subtitle: 'Bank', type: 'link', content: 'https://play.google.com/store/apps/details?id=ph.com.gotyme', order_index: 28 },
  { category: 'playstore-apps', title: 'UNIQLO', subtitle: 'Clothes', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.uniqlo.ph.catalogue', order_index: 29 },
  { category: 'playstore-apps', title: 'ZUS', subtitle: 'Cafe', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.coffee.love_coffee', order_index: 30 },
  { category: 'playstore-apps', title: 'Riot', subtitle: 'Games', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.riotgames.mobile.leagueconnect', order_index: 31 },
  { category: 'playstore-apps', title: 'Steam', subtitle: 'PC', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.valvesoftware.android.steam.community', order_index: 32 },
  { category: 'playstore-apps', title: 'Strava', subtitle: 'Fitness', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.strava', order_index: 33 },
  { category: 'playstore-apps', title: 'Wheelbase', subtitle: 'Racing', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.wheelbase.app', order_index: 34 },

  // PLAYSTORE GAMES
  { category: 'playstore-games', title: 'Almanac', subtitle: 'Game', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.voodoo.almanac', order_index: 0 },
  { category: 'playstore-games', title: 'MLBB', subtitle: 'MOBA', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.mobile.legends', order_index: 1 },
  { category: 'playstore-games', title: 'Genshin', subtitle: 'Action RPG', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.miHoYo.GenshinImpact', order_index: 2 },
  { category: 'playstore-games', title: 'HSR', subtitle: 'Turn RPG', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.HoYoverse.hkrpgoversea', order_index: 3 },
  { category: 'playstore-games', title: 'WuWa', subtitle: 'Action RPG', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.kurogame.wutheringwaves.global', order_index: 4 },
  { category: 'playstore-games', title: 'CODM', subtitle: 'Shooter', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.activision.callofduty.shooter', order_index: 5 },
  { category: 'playstore-games', title: 'Block', subtitle: 'Puzzle', type: 'link', content: 'https://play.google.com/store/apps/details?id=com.block.juggle', order_index: 6 },

  // WEB TOOLS
  { category: 'web-tools', title: 'Catbox', subtitle: 'File Hosting', type: 'link', content: 'https://catbox.moe/', order_index: 0 },
  { category: 'web-tools', title: 'LRC Gen', subtitle: 'Lyric Timestamps', type: 'link', content: 'https://lrcgenerator.com/', order_index: 1 },
  { category: 'web-tools', title: 'Pagedrop', subtitle: 'Markdown Hosting', type: 'link', content: 'https://pagedrop.io/', order_index: 2 },
  { category: 'web-tools', title: 'CodePen', subtitle: 'Web Editor', type: 'link', content: 'https://codepen.io/', order_index: 3 },
  { category: 'web-tools', title: 'Firebase', subtitle: 'Google Backend', type: 'link', content: 'https://firebase.google.com/', order_index: 4 },

  // PC AUTOMATION SCRIPTS
  { category: 'pc-automation', title: 'VS CODE EXTENSIONS', subtitle: 'ESSENTIALS', type: 'script', content: 'assets/VS CODE ESSENTIALS.bat', order_index: 0 },
  { category: 'pc-automation', title: 'Coding Software', subtitle: 'Bat Script', type: 'script', content: 'assets/softwares.bat', order_index: 1 },
  { category: 'pc-automation', title: 'VS Code Ext.', subtitle: 'Bat Script', type: 'script', content: 'assets/extensions.bat', order_index: 2 },

  // CLOUD STORAGE (MOD APKS)
  { category: 'cloud-storage', title: 'File Manager', subtitle: 'Mega Link', type: 'link', content: 'https://mega.nz/file/CegxkYZT#Lw1pVTKZ_I9QEXhFtoGhvKcnxwHCNgiRPIMga2QD7Mc', order_index: 0 },
  { category: 'cloud-storage', title: 'BG Eraser', subtitle: 'Mega Link', type: 'link', content: 'https://mega.nz/file/bLRjXDRD#d9c3W-YwkEI2AKQo-06ZwfcLUQ-HwQeoZRV1Lbkd0DE', order_index: 1 },
  { category: 'cloud-storage', title: '1DM+', subtitle: 'Mega Link', type: 'link', content: 'https://mega.nz/file/CLgCyJDD#90KGGso55W_GLCoss6hY8j29J8VEHXJ1IqbBtwEetjA', order_index: 2 },
  { category: 'cloud-storage', title: 'Fotor', subtitle: 'Mega Link', type: 'link', content: 'https://mega.nz/file/qaITVBpK#mJcq7gA87w0toJKf8c9-0e0dHnlXJgzJAhUbliEy6uw', order_index: 3 },
  { category: 'cloud-storage', title: 'Photoroom', subtitle: 'Mega Link', type: 'link', content: 'https://mega.nz/file/iXo0TLRI#tMky_w240uxINuXbb3BfQXCYExtjdrh7cKuRe4jLKJc', order_index: 4 },
  { category: 'cloud-storage', title: 'Capcut', subtitle: 'Mega Link', type: 'link', content: 'https://mega.nz/file/qLhXRZ6b#rI8NpkfIpG35NgH6V7XI-3KvpBlvcxcc-Y0CiZ4Yk08', order_index: 5 },
  { category: 'cloud-storage', title: 'Date Editor', subtitle: 'Mega Link', type: 'link', content: 'https://mega.nz/file/qLhXRZ6b#rI8NpkfIpG35NgH6V7XI-3KvpBlvcxcc-Y0CiZ4Yk08', order_index: 6 },
  { category: 'cloud-storage', title: 'Inshot', subtitle: 'Mega Link', type: 'link', content: 'https://mega.nz/file/bawzQZiC#DTejlo8rraMAUaQUQL2uXOZM3o7YFO911AakG8KdlRg', order_index: 7 },
  { category: 'cloud-storage', title: 'Picsart', subtitle: 'Mega Link', type: 'link', content: 'https://mega.nz/file/SCgXSb6L#Roni2b5zTI9DqbbkdJdgsTKkbDeDUZKMfnPRKI8D9WQ', order_index: 8 },

  // APP DOWNLOAD
  { category: 'app-download', title: 'Web App', subtitle: 'Open Mega Directory', type: 'link', content: 'https://mega.nz/folder/KKBkyDZQ#bQvlfzmxgAb9RJcxUHAtrA', order_index: 0 }
];