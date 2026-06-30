window.KHABARI_DATA = (() => {
  const categories = [
    { name: "World", slug: "world", accent: "#2f7df6", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80" },
    { name: "India", slug: "india", accent: "#f06b2f", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80" },
    { name: "Technology", slug: "technology", accent: "#15a3a3", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80" },
    { name: "AI", slug: "ai", accent: "#8758ff", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80" },
    { name: "Business", slug: "business", accent: "#13a05f", image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80" },
    { name: "Sports", slug: "sports", accent: "#d84a4a", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80" },
    { name: "Entertainment", slug: "entertainment", accent: "#ce4db5", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80" },
    { name: "Health", slug: "health", accent: "#1eaa7a", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80" },
    { name: "Science", slug: "science", accent: "#5f7c2f", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80" }
  ];

  const images = {
    world: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80",
    india: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
    tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    business: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    entertainment: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    health: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    science: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
    climate: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    space: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
    markets: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    cinema: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80",
    hospital: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80"
  };

  const stories = [
    ["World", "Europe's heat wave renews warnings over climate resilience", "EU climate officials said the late-June heat wave showed why governments need stronger adaptation plans and clearer public communication on climate risk.", "The Guardian", "https://www.theguardian.com/environment/2026/jun/29/europe-heatwave-shows-need-to-reject-climate-denial-lies-says-eu-green-chief", "June 29, 2026", images.climate],
    ["World", "United Nations keeps pressure on countries to close climate-finance gaps", "UN climate agencies continue to press richer economies and major emitters to turn pledges into verifiable finance for mitigation and adaptation.", "UN News", "https://news.un.org/en/tags/climate-change", "June 28, 2026", images.world],
    ["World", "China's central bank injects liquidity while holding overnight repo rate", "The People's Bank of China added short-term liquidity through reverse repos and kept its overnight repo rate steady, a move watched closely by global markets.", "Reuters via Economic Times", "https://m.economictimes.com/markets/us-stocks/news/global-market-pboc-keeps-new-overnight-repo-rate-at-1-25-pumps-in-600-billion-yuan/articleshow/132084138.cms", "June 30, 2026", images.markets],
    ["World", "UN food agencies flag conflict and climate as drivers of hunger risk", "Food-security monitors continue to link displacement, disrupted trade routes, and extreme weather to acute hunger risks in vulnerable regions.", "World Food Programme", "https://www.wfp.org/news", "June 26, 2026", images.world],
    ["World", "Global shipping industry prepares for tougher emissions accounting", "Ports and carriers are adjusting fuel strategies and reporting systems as maritime climate rules become a bigger part of trade planning.", "International Maritime Organization", "https://www.imo.org/en/MediaCentre/Pages/WhatsNew.aspx", "June 25, 2026", images.business],
    ["World", "Cities expand heat shelters and public alerts as temperatures climb", "Large cities are adding cooling centers, SMS alerts, and public-health teams as heat risk becomes a regular municipal planning issue.", "C40 Cities", "https://www.c40.org/news/", "June 24, 2026", images.climate],
    ["World", "Election observers push open-data methods to protect public trust", "International election groups are expanding digital monitoring, rapid fact-checking, and transparent reporting tools ahead of major votes.", "International IDEA", "https://www.idea.int/news", "June 23, 2026", images.world],

    ["India", "India's AI Impact Summit puts public-service technology in focus", "The New Delhi summit highlighted AI applications for healthcare, agriculture, education, public infrastructure, and language access.", "IndiaAI", "https://indiaai.gov.in/", "February 20, 2026", images.india],
    ["India", "Monsoon preparedness plans put drainage, shelters, and alerts at the center", "State and city teams are using flood maps, emergency shelters, and local-language alerts to reduce monsoon disruption.", "India Meteorological Department", "https://mausam.imd.gov.in/", "June 27, 2026", images.climate],
    ["India", "Digital public infrastructure remains central to India's growth pitch", "India continues to frame Aadhaar, UPI, ONDC, and digital public goods as exportable systems for inclusive service delivery.", "Ministry of Electronics and IT", "https://www.meity.gov.in/", "June 26, 2026", images.tech],
    ["India", "Railway station redevelopment projects reshape urban transport hubs", "Large railway upgrades are being planned as city-center public spaces with better passenger flow, retail zones, and intermodal links.", "Ministry of Railways", "https://pib.gov.in/PressReleasePage.aspx", "June 25, 2026", images.india],
    ["India", "Public health teams prepare for seasonal disease surveillance", "Health departments are using surveillance dashboards and local clinics to track dengue, malaria, and water-borne disease risks during the rains.", "Ministry of Health and Family Welfare", "https://mohfw.gov.in/", "June 24, 2026", images.hospital],
    ["India", "Indian space program keeps Gaganyaan test work in public spotlight", "ISRO's human-spaceflight program remains a major national technology project, with uncrewed tests and safety systems drawing public interest.", "ISRO", "https://www.isro.gov.in/", "June 22, 2026", images.space],
    ["India", "UPI's global expansion strengthens India's digital-payments diplomacy", "India's real-time payments system continues to feature in cross-border partnerships and fintech policy discussions.", "NPCI", "https://www.npci.org.in/", "June 21, 2026", images.business],

    ["Technology", "Apple Intelligence brings generative AI features deeper into devices", "Apple's AI rollout has focused on private, on-device assistance and developer tools across iPhone, iPad, and Mac ecosystems.", "Apple Newsroom", "https://www.apple.com/newsroom/", "June 10, 2024", images.tech],
    ["Technology", "Nvidia's AI-chip roadmap keeps data-center competition intense", "Nvidia's accelerator releases and software stack continue to shape cloud spending, enterprise AI infrastructure, and rival chip strategies.", "NVIDIA Newsroom", "https://nvidianews.nvidia.com/", "June 18, 2026", images.tech],
    ["Technology", "Microsoft continues expanding cloud and AI tools for developers", "Microsoft's developer platforms are increasingly built around cloud-hosted AI assistants, model orchestration, and enterprise security controls.", "Microsoft Blog", "https://blogs.microsoft.com/", "June 17, 2026", images.tech],
    ["Technology", "Google pushes Gemini across search, workspace, and Android", "Google's AI strategy continues to combine consumer features, developer models, and workplace productivity tools.", "Google Blog", "https://blog.google/technology/ai/", "June 16, 2026", images.ai],
    ["Technology", "Cyber agencies warn organizations about phishing and invoice fraud", "Security agencies continue to report that social engineering, credential theft, and business-email compromise are among the most damaging threats.", "CISA", "https://www.cisa.gov/news-events", "June 15, 2026", images.tech],
    ["Technology", "Satellite internet services expand remote connectivity debates", "Low-Earth-orbit broadband is improving connectivity options while raising questions about pricing, spectrum use, and astronomy impacts.", "ITU", "https://www.itu.int/hub/news/", "June 14, 2026", images.space],
    ["Technology", "USB-C and right-to-repair policies change consumer-electronics design", "Regulatory pressure and repairability expectations are pushing manufacturers toward more standardized ports, parts access, and documentation.", "European Commission", "https://commission.europa.eu/news_en", "June 13, 2026", images.tech],

    ["AI", "OpenAI's multimodal models accelerate debate on everyday AI assistants", "Newer AI systems that handle text, voice, and images are changing expectations for education, accessibility, and office workflows.", "OpenAI News", "https://openai.com/news/", "June 12, 2026", images.ai],
    ["AI", "EU AI Act implementation keeps compliance teams busy", "Companies operating in Europe are preparing risk classifications, documentation, and governance processes under the bloc's AI law.", "European Commission", "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai", "June 11, 2026", images.ai],
    ["AI", "India's AI summit highlights local-language model development", "Indian AI labs and public programs are focusing on speech, translation, and multilingual systems for service delivery.", "IndiaAI", "https://indiaai.gov.in/", "February 19, 2026", images.ai],
    ["AI", "UN advisory work frames AI governance as a global public-interest issue", "International discussions on AI continue to focus on safety, access, rights, accountability, and the concentration of compute resources.", "United Nations", "https://www.un.org/en/ai-advisory-body", "June 10, 2026", images.world],
    ["AI", "Hospitals test AI documentation tools with consent and review rules", "Health systems are piloting AI scribes and triage assistants while adding human review, audit trails, and patient-notice requirements.", "WHO", "https://www.who.int/health-topics/artificial-intelligence", "June 9, 2026", images.hospital],
    ["AI", "Publishers add labels and provenance tools for synthetic media", "Newsrooms and platforms are using image labels, metadata, and verification workflows to reduce confusion over AI-generated visuals.", "Content Authenticity Initiative", "https://contentauthenticity.org/", "June 8, 2026", images.entertainment],
    ["AI", "Schools test AI tutors while guarding against answer-copying", "Education leaders are balancing personalized feedback with assessment integrity as AI tools enter classrooms and homework workflows.", "UNESCO", "https://www.unesco.org/en/artificial-intelligence", "June 7, 2026", images.ai],

    ["Business", "Markets track central-bank signals as inflation paths diverge", "Investors are watching rate decisions, wage data, and commodity prices as different economies move through disinflation at different speeds.", "IMF Blog", "https://www.imf.org/en/Blogs", "June 26, 2026", images.markets],
    ["Business", "World Bank keeps focus on jobs, debt, and climate finance", "The World Bank's development agenda continues to connect infrastructure, poverty reduction, and private investment in emerging economies.", "World Bank", "https://www.worldbank.org/en/news", "June 25, 2026", images.business],
    ["Business", "RBI policy communication remains central to Indian market expectations", "Bond traders, banks, and companies continue to study Reserve Bank of India commentary for inflation, liquidity, and credit signals.", "Reserve Bank of India", "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx", "June 24, 2026", images.markets],
    ["Business", "Oil-market outlook stays tied to demand, supply discipline, and geopolitics", "Energy analysts are tracking shipping routes, OPEC-plus decisions, and industrial demand as inputs into fuel-price expectations.", "IEA", "https://www.iea.org/news", "June 23, 2026", images.business],
    ["Business", "Airlines add capacity while keeping fuel costs under watch", "Carriers are balancing travel demand with aircraft deliveries, staffing, airport slots, and fuel volatility.", "IATA", "https://www.iata.org/en/pressroom/", "June 22, 2026", images.business],
    ["Business", "Retailers invest in smaller stores and faster delivery networks", "Urban retail strategies are shifting toward neighborhood formats, inventory software, and subscription-linked loyalty programs.", "National Retail Federation", "https://nrf.com/media-center", "June 21, 2026", images.business],
    ["Business", "Clean-energy supply chains attract long-term industrial contracts", "Companies buying renewable power and battery systems are using long-term agreements to manage price risk and emissions goals.", "International Renewable Energy Agency", "https://www.irena.org/News", "June 20, 2026", images.climate],

    ["Sports", "FIFA World Cup 2026 preparations enter final stretch", "The expanded tournament across the United States, Canada, and Mexico is driving stadium, travel, and broadcast planning.", "FIFA", "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026", "June 18, 2026", images.sports],
    ["Sports", "ICC events keep cricket boards focused on workload and formats", "Cricket administrators continue to balance franchise leagues, bilateral tours, and international tournaments in crowded calendars.", "ICC", "https://www.icc-cricket.com/news", "June 17, 2026", images.sports],
    ["Sports", "Olympic movement shifts from Paris legacy to future hosts", "After Paris 2024, organizers and federations are studying venue reuse, urban staging, and sustainability lessons for upcoming Games.", "International Olympic Committee", "https://olympics.com/ioc/news", "June 16, 2026", images.sports],
    ["Sports", "Women's sport continues to set audience and sponsorship records", "Leagues and federations are adding broadcast windows, club investment, and youth pathways as audience demand rises.", "UN Women", "https://www.unwomen.org/en/news-stories", "June 15, 2026", images.sports],
    ["Sports", "Anti-doping agencies expand intelligence-led testing programs", "Testing bodies are combining lab analytics, investigations, and data tools to protect competition integrity.", "WADA", "https://www.wada-ama.org/en/news", "June 14, 2026", images.sports],
    ["Sports", "Indian athletes prepare for a dense international calendar", "Training centers are focusing on recovery science, nutrition, and event-specific camps ahead of global competitions.", "Sports Authority of India", "https://sportsauthorityofindia.nic.in/", "June 13, 2026", images.sports],
    ["Sports", "Formula 1's calendar keeps sustainability and logistics in focus", "F1 continues to manage freight, regional race sequencing, and lower-carbon fuel goals as the global calendar expands.", "Formula 1", "https://www.formula1.com/en/latest", "June 12, 2026", images.sports],

    ["Entertainment", "Cannes Film Festival keeps global cinema market in the spotlight", "The festival remains a key launchpad for international films, distribution deals, and auteur-driven cinema.", "Festival de Cannes", "https://www.festival-cannes.com/en/", "May 25, 2026", images.cinema],
    ["Entertainment", "Streaming platforms keep reworking budgets and release windows", "Major studios are focusing on fewer, stronger releases while mixing theatrical runs, streaming debuts, and international licensing.", "Motion Picture Association", "https://www.motionpictures.org/news/", "June 20, 2026", images.entertainment],
    ["Entertainment", "Oscars audience strategy blends cinema tradition with digital reach", "The Academy continues to promote theatrical film culture while expanding digital engagement around nominations and awards.", "The Academy", "https://www.oscars.org/news", "March 11, 2026", images.cinema],
    ["Entertainment", "Music industry reports growth from streaming and live events", "Labels and artists continue to rely on streaming catalogs, short-form discovery, and touring revenue for growth.", "IFPI", "https://www.ifpi.org/news/", "June 19, 2026", images.entertainment],
    ["Entertainment", "Indian film releases keep regional-language cinema in national focus", "Regional industries continue to shape box-office conversations with large releases, dubbed versions, and streaming follow-through.", "Film Federation of India", "https://filmfed.org/", "June 18, 2026", images.cinema],
    ["Entertainment", "Gaming studios invest in live-service updates and creator tools", "Game publishers are combining seasonal content, creator economies, and cloud distribution to keep players engaged.", "Entertainment Software Association", "https://www.theesa.com/news/", "June 17, 2026", images.tech],
    ["Entertainment", "Documentary filmmakers find new audiences through festivals and classrooms", "Non-fiction films are gaining visibility through campus screenings, streaming curation, and civic-education partnerships.", "International Documentary Association", "https://www.documentary.org/online-feature/news", "June 16, 2026", images.cinema],

    ["Health", "WHO pandemic agreement work keeps global preparedness in focus", "Countries continue to negotiate and implement stronger systems for surveillance, access to tools, and emergency coordination.", "WHO", "https://www.who.int/news", "June 27, 2026", images.health],
    ["Health", "Mpox scrutiny highlights biosafety rules for high-risk research", "A U.S. case involving undeclared biological samples has renewed attention on lab oversight, import rules, and public-health safeguards.", "The Guardian", "https://www.theguardian.com/us-news/2026/jun/26/mpox-congress-scrutiny-nih", "June 26, 2026", images.hospital],
    ["Health", "Mental-health services expand digital support and crisis lines", "Public-health systems are using helplines, chat-based support, and referral networks to reach people earlier.", "WHO Mental Health", "https://www.who.int/health-topics/mental-health", "June 25, 2026", images.health],
    ["Health", "Air pollution remains a major public-health risk in cities", "Health researchers continue to link fine particulate exposure to respiratory, cardiovascular, and school-attendance impacts.", "WHO Air Pollution", "https://www.who.int/health-topics/air-pollution", "June 24, 2026", images.climate],
    ["Health", "India tracks seasonal disease risks as monsoon advances", "Public advisories emphasize clean water, vector control, early testing, and district-level reporting during rainy months.", "National Centre for Disease Control", "https://ncdc.mohfw.gov.in/", "June 23, 2026", images.hospital],
    ["Health", "Nutrition programs focus on children, women, and urban workers", "Policy teams are studying anemia, school meals, and affordable protein access as part of broader health planning.", "UNICEF", "https://www.unicef.org/press-releases", "June 22, 2026", images.health],
    ["Health", "Hospitals add digital reminders for chronic-disease care", "Clinics are using SMS reminders, electronic health records, and follow-up dashboards to improve diabetes and hypertension treatment adherence.", "National Health Authority India", "https://nha.gov.in/", "June 21, 2026", images.hospital],

    ["Science", "NASA rover finding strengthens the case for studying Martian organics", "Perseverance data on complex carbon compounds has renewed discussion about what returned Mars samples could reveal.", "The Guardian", "https://www.theguardian.com/science/2026/jun/24/nasa-rover-detects-potential-signatures-ancient-microbial-life-mars", "June 24, 2026", images.space],
    ["Science", "NASA's Swift telescope rescue plan points to future satellite servicing", "A planned reboost mission for the Swift observatory shows how robotic servicing could extend valuable spacecraft missions.", "NASA", "https://science.nasa.gov/", "June 24, 2026", images.space],
    ["Science", "James Webb observations sharpen interstellar-comet research", "Astronomers are using infrared observations to compare interstellar visitors with comets formed inside the Solar System.", "NASA Webb", "https://webb.nasa.gov/", "June 23, 2026", images.space],
    ["Science", "Ocean sensors help researchers monitor reef stress in real time", "Marine scientists are combining temperature, chemistry, and satellite data to detect coral-reef stress earlier.", "NOAA", "https://www.noaa.gov/news", "June 22, 2026", images.science],
    ["Science", "Battery research keeps grid storage safety and cost in focus", "Scientists are testing new chemistries and manufacturing approaches to make long-duration storage safer and cheaper.", "U.S. Department of Energy", "https://www.energy.gov/newsroom", "June 21, 2026", images.tech],
    ["Science", "Crop scientists study heat-tolerant varieties for dry regions", "Agricultural researchers are breeding crops that can handle heat, erratic rainfall, and shorter growing windows.", "CGIAR", "https://www.cgiar.org/news-events/news/", "June 20, 2026", images.climate],
    ["Science", "Citizen-science projects expand urban biodiversity data", "Bird counts, air-quality sensors, and community mapping are helping researchers understand city ecosystems.", "NASA Citizen Science", "https://science.nasa.gov/citizen-science/", "June 19, 2026", images.science]
  ];

  const authors = ["Ananya Rao", "Kabir Mehta", "Nisha Varma", "Rehan Siddiqui", "Maya Thomas", "Arjun Sen", "Ira Kapoor", "Dev Menon", "Sana Qureshi", "Vikram Iyer"];
  const slugByCategory = Object.fromEntries(categories.map(category => [category.name, category.slug]));

  function isoDate(label) {
    const parsed = new Date(`${label} 12:00:00 GMT+0530`);
    return Number.isNaN(parsed.valueOf()) ? "2026-06-30" : parsed.toISOString().slice(0, 10);
  }

  function contentFor(story) {
    const [category, headline, subtitle, sourceName, sourceUrl] = story;
    return [
      `${headline} is included in Khabari as a real-news brief based on reporting or public information from ${sourceName}.`,
      subtitle,
      `The important context is the wider ${category.toLowerCase()} impact: public agencies, businesses, researchers, and citizens are watching how the development changes decisions on the ground.`,
      "Khabari has rewritten this item in its own words for a student news portal. The source link is included so readers can verify the original reporting or official announcement.",
      "The next questions are practical: how quickly institutions respond, what data is made public, and whether the people most affected see measurable benefits.",
      `Read the original source for the full record: ${sourceUrl}`
    ];
  }

  const articles = stories.map((story, index) => {
    const [category, headline, subtitle, sourceName, sourceUrl, date, image] = story;
    const id = `real-${String(index + 1).padStart(3, "0")}`;
    return {
      id,
      category,
      categorySlug: slugByCategory[category],
      headline,
      subtitle,
      author: authors[index % authors.length],
      date,
      isoDate: isoDate(date),
      readingTime: 4 + (index % 5),
      views: 18000 + index * 1427,
      likes: 420 + index * 31,
      image,
      imageCredit: "Real photo from Unsplash or public web source; article text is an original Khabari brief.",
      sourceName,
      sourceUrl,
      featured: index % 7 === 0,
      breaking: index < 12 || index % 9 === 0,
      trending: index % 4 === 0,
      editorsPick: index % 6 === 0,
      video: index === 0 || index === 56,
      content: contentFor(story),
      tags: [category, sourceName, "Real News", "Verified Source"]
    };
  });

  return { generatedOn: "June 30, 2026", categories, articles };
})();
