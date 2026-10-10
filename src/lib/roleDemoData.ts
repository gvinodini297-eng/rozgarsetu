export interface RoleInfo {
  summary: string;
  skills: string[];
  qualification: string;
  experience: string;
  salary: string;
  jobType: string;
}

const r = (
  summary: string,
  skills: string[],
  qualification: string,
  experience: string,
  salary: string,
  jobType: string = 'Full-time'
): RoleInfo => ({ summary, skills, qualification, experience, salary, jobType });

export const ROLE_INFO: Record<string, RoleInfo> = {
  // ---------- Software & IT ----------
  'AI Engineer': r('Build and deploy machine learning and AI-powered features for products.', ['Python', 'Machine Learning', 'TensorFlow / PyTorch', 'Data preprocessing', 'REST APIs'], 'B.Tech / M.Tech in CS, AI or related field', '1-3 years', '₹6 - ₹14 LPA (approx.)'),
  'Prompt Engineer': r('Design and test prompts and workflows for large language model applications.', ['Prompt design', 'LLM APIs', 'Python basics', 'Problem solving', 'Clear writing'], 'Any graduate; CS or linguistics preferred', '0-2 years', '₹4 - ₹10 LPA (approx.)'),
  'Java Developer': r('Develop and maintain backend applications using Java and Spring.', ['Core Java', 'Spring Boot', 'SQL / MySQL', 'REST APIs', 'Git'], 'B.Tech / BCA / MCA', '0-3 years', '₹3.5 - ₹9 LPA (approx.)'),
  'Python Developer': r('Build web services, scripts and automation using Python.', ['Python', 'Django / Flask', 'SQL', 'REST APIs', 'Git'], 'B.Tech / BCA / B.Sc Computers', '0-3 years', '₹3.5 - ₹9 LPA (approx.)'),
  'Frontend Developer': r('Build responsive user interfaces for web applications.', ['HTML & CSS', 'JavaScript', 'React', 'Responsive design', 'Git'], 'B.Tech / BCA / equivalent certification', '0-3 years', '₹3 - ₹8 LPA (approx.)'),
  'Backend Developer': r('Build server-side logic, databases and APIs for applications.', ['Node.js / Java / Python', 'Databases', 'REST APIs', 'Authentication', 'Git'], 'B.Tech / BCA / MCA', '1-3 years', '₹4 - ₹10 LPA (approx.)'),
  'Data Analyst': r('Collect, clean and analyse data to produce reports and insights.', ['Excel', 'SQL', 'Python / Power BI', 'Data visualization', 'Statistics basics'], 'Any graduate; B.Tech / B.Sc / BCA preferred', '0-2 years', '₹3.5 - ₹8 LPA (approx.)'),
  'Cybersecurity Engineer': r('Protect systems and networks by finding and fixing security weaknesses.', ['Networking basics', 'Security tools', 'Vulnerability assessment', 'Linux', 'Incident response'], 'B.Tech / B.Sc in CS or IT', '1-4 years', '₹5 - ₹12 LPA (approx.)'),
  'Cloud Engineer': r('Set up and manage cloud infrastructure and deployments.', ['AWS / Azure / GCP', 'Linux', 'Networking', 'CI/CD', 'Docker'], 'B.Tech / BCA / relevant cloud certification', '1-4 years', '₹5 - ₹12 LPA (approx.)'),
  'UI/UX Designer': r('Design user-friendly screens and flows for apps and websites.', ['Figma', 'Wireframing', 'User research', 'Visual design', 'Prototyping'], 'Any graduate; design diploma preferred', '0-3 years', '₹3 - ₹8 LPA (approx.)'),

  // ---------- Restaurants & Cafes ----------
  'Chef': r('Prepare dishes, maintain food quality and manage kitchen operations.', ['Cooking techniques', 'Food safety & hygiene', 'Menu knowledge', 'Time management', 'Kitchen management'], 'Diploma in Culinary Arts / Hotel Management preferred', '2-5 years', '₹20,000 - ₹40,000 / month (approx.)'),
  'Sous Chef': r('Assist the head chef and supervise daily kitchen staff and preparation.', ['Kitchen supervision', 'Inventory control', 'Food costing', 'Team leadership', 'Food safety'], 'Diploma in Hotel Management / Culinary Arts', '3-6 years', '₹25,000 - ₹45,000 / month (approx.)'),
  'Waiter': r('Serve guests, take orders and ensure a pleasant dining experience.', ['Customer service', 'Communication', 'Order taking', 'Table etiquette', 'Teamwork'], '10th / Intermediate', 'Fresher - 2 years', '₹12,000 - ₹20,000 / month (approx.)'),
  'Receptionist': r('Greet visitors, answer calls and handle front-desk coordination.', ['Communication', 'Phone etiquette', 'Basic computer skills', 'Scheduling', 'Customer handling'], 'Intermediate / Any graduate', 'Fresher - 2 years', '₹12,000 - ₹22,000 / month (approx.)'),
  'Cashier': r('Handle billing, cash and card payments at the counter.', ['Billing / POS', 'Basic maths', 'Cash handling', 'Accuracy', 'Customer service'], '10th / Intermediate', 'Fresher - 2 years', '₹12,000 - ₹20,000 / month (approx.)'),
  'Kitchen Helper': r('Assist chefs with preparation, cleaning and kitchen upkeep.', ['Food preparation', 'Cleanliness', 'Stamina', 'Following instructions', 'Teamwork'], 'No minimum qualification', 'Fresher', '₹10,000 - ₹16,000 / month (approx.)'),
  'Barista': r('Prepare coffee and beverages and serve customers at a cafe counter.', ['Espresso preparation', 'Customer service', 'POS billing', 'Cleanliness', 'Menu knowledge'], '10th / Intermediate; barista training is a plus', 'Fresher - 2 years', '₹12,000 - ₹20,000 / month (approx.)', 'Part-time / Full-time'),
  'Restaurant Manager': r('Manage staff, guest experience, inventory and daily restaurant operations.', ['Team management', 'Customer handling', 'Inventory & cost control', 'Scheduling', 'Problem solving'], 'Degree / Diploma in Hotel Management preferred', '3-7 years', '₹30,000 - ₹55,000 / month (approx.)'),

  // ---------- Hotels & Hospitality ----------
  'Front Office Executive': r('Manage guest check-in, check-out and reservations at the hotel front desk.', ['Communication', 'Hotel software', 'Reservations', 'Guest handling', 'English / Telugu / Hindi'], 'Graduate / Diploma in Hotel Management', 'Fresher - 3 years', '₹15,000 - ₹28,000 / month (approx.)'),
  'Housekeeping Staff': r('Clean and prepare rooms and public areas to hotel standards.', ['Cleaning methods', 'Attention to detail', 'Time management', 'Hygiene standards', 'Teamwork'], '10th pass', 'Fresher - 2 years', '₹10,000 - ₹16,000 / month (approx.)'),
  'Hotel Manager': r('Oversee all hotel departments, staff, guest satisfaction and revenue.', ['Leadership', 'Operations management', 'Budgeting', 'Guest relations', 'Problem solving'], 'Degree / Diploma in Hotel Management', '5-10 years', '₹40,000 - ₹90,000 / month (approx.)'),
  'Guest Relations Executive': r('Welcome guests, handle requests and resolve complaints.', ['Communication', 'Problem solving', 'Hospitality etiquette', 'Multilingual speaking', 'Patience'], 'Graduate; Hotel Management preferred', '1-3 years', '₹16,000 - ₹30,000 / month (approx.)'),
  'Event Coordinator': r('Plan and coordinate events, vendors and on-site arrangements.', ['Planning', 'Vendor coordination', 'Communication', 'Budget handling', 'Time management'], 'Any graduate; event management course preferred', '1-3 years', '₹15,000 - ₹30,000 / month (approx.)'),

  // ---------- Healthcare ----------
  'Nurse': r('Provide patient care, administer medication and support doctors.', ['Patient care', 'Vital signs monitoring', 'Medication administration', 'Documentation', 'Empathy'], 'GNM / B.Sc Nursing with registration', 'Fresher - 5 years', '₹15,000 - ₹32,000 / month (approx.)'),
  'Pharmacist': r('Dispense medicines, verify prescriptions and manage pharmacy stock.', ['Prescription reading', 'Drug knowledge', 'Inventory management', 'Billing', 'Patient counselling'], 'D.Pharm / B.Pharm with registration', 'Fresher - 3 years', '₹15,000 - ₹30,000 / month (approx.)'),
  'Lab Technician': r('Collect samples and perform diagnostic tests in a laboratory.', ['Sample collection', 'Lab equipment handling', 'Accuracy', 'Hygiene & safety', 'Report preparation'], 'DMLT / B.Sc MLT', 'Fresher - 3 years', '₹13,000 - ₹25,000 / month (approx.)'),
  'Medical Assistant': r('Support doctors and nurses with patient records and basic procedures.', ['Patient records', 'Basic first aid', 'Communication', 'Hospital procedures', 'Organization'], 'Intermediate / Diploma in healthcare', 'Fresher - 2 years', '₹12,000 - ₹22,000 / month (approx.)'),
  'Caregiver': r('Assist patients or elderly people with daily care and routine needs.', ['Patient care', 'Patience', 'Basic first aid', 'Personal hygiene support', 'Compassion'], '10th pass; caregiver training preferred', 'Fresher - 2 years', '₹12,000 - ₹22,000 / month (approx.)'),
  'Hospital Administrator': r('Manage hospital administration, staff coordination and records.', ['Healthcare administration', 'Leadership', 'Budgeting', 'Compliance', 'Communication'], 'Graduate / MBA in Hospital Management', '3-8 years', '₹30,000 - ₹60,000 / month (approx.)'),

  // ---------- Education ----------
  'School Teacher': r('Teach classes, prepare lessons and evaluate student progress.', ['Classroom management', 'Subject knowledge', 'Communication', 'Lesson planning', 'Patience'], 'Graduate + B.Ed', 'Fresher - 5 years', '₹15,000 - ₹35,000 / month (approx.)'),
  'Maths Teacher': r('Teach mathematics concepts and prepare students for exams.', ['Mathematics', 'Problem solving', 'Clear explanation', 'Lesson planning', 'Patience'], 'B.Sc Maths / B.Tech + B.Ed preferred', 'Fresher - 5 years', '₹15,000 - ₹35,000 / month (approx.)'),
  'Science Teacher': r('Teach physics, chemistry or biology with practical examples.', ['Subject knowledge', 'Experiments / demonstrations', 'Communication', 'Lesson planning', 'Patience'], 'B.Sc + B.Ed preferred', 'Fresher - 5 years', '₹15,000 - ₹35,000 / month (approx.)'),
  'English Teacher': r('Teach reading, writing, grammar and spoken English.', ['Grammar', 'Spoken English', 'Communication', 'Lesson planning', 'Creativity'], 'Graduate in English + B.Ed preferred', 'Fresher - 5 years', '₹15,000 - ₹35,000 / month (approx.)'),
  'Tutor': r('Provide one-to-one or small-group tutoring for school students.', ['Subject knowledge', 'Clear explanation', 'Patience', 'Time management', 'Student motivation'], 'Graduate / final-year student', 'Any', '₹8,000 - ₹20,000 / month (approx.)', 'Part-time'),
  'Academic Counselor': r('Guide students and parents on courses, admissions and career options.', ['Communication', 'Counselling', 'Course knowledge', 'Listening', 'Follow-up'], 'Any graduate', '0-3 years', '₹15,000 - ₹28,000 / month (approx.)'),
  'Lab Assistant': r('Prepare lab equipment and assist students and teachers during practicals.', ['Lab safety', 'Equipment handling', 'Organization', 'Record keeping', 'Following instructions'], 'Intermediate / B.Sc', 'Fresher - 2 years', '₹10,000 - ₹18,000 / month (approx.)'),

  // ---------- Banking & Finance ----------
  'Accountant': r('Maintain books of accounts, GST filings and financial statements.', ['Tally', 'GST', 'MS Excel', 'Bookkeeping', 'Accuracy'], 'B.Com / M.Com', '1-4 years', '₹18,000 - ₹35,000 / month (approx.)'),
  'Banking Associate': r('Assist customers with accounts, deposits and basic banking services.', ['Customer service', 'Basic banking knowledge', 'Computer skills', 'Accuracy', 'Communication'], 'Any graduate', 'Fresher - 2 years', '₹15,000 - ₹28,000 / month (approx.)'),
  'Financial Analyst': r('Analyse financial data and prepare reports to support business decisions.', ['Excel modelling', 'Financial analysis', 'Reporting', 'Analytical thinking', 'Presentation'], 'B.Com / MBA Finance / CA Inter', '1-4 years', '₹4 - ₹10 LPA (approx.)'),
  'Loan Officer': r('Evaluate loan applications and guide customers through the process.', ['Credit assessment', 'Documentation', 'Communication', 'Customer handling', 'Basic finance'], 'Any graduate', '1-3 years', '₹18,000 - ₹35,000 / month (approx.)'),
  'Relationship Manager': r('Build and manage client relationships and promote financial products.', ['Sales skills', 'Communication', 'Product knowledge', 'Client handling', 'Target orientation'], 'Graduate / MBA preferred', '2-5 years', '₹25,000 - ₹50,000 / month (approx.)'),
  'Insurance Advisor': r('Advise customers on insurance plans and assist with policy needs.', ['Communication', 'Product knowledge', 'Sales skills', 'Customer follow-up', 'Trust building'], 'Intermediate / Any graduate', 'Fresher - 3 years', '₹12,000 - ₹30,000 / month + commission (approx.)'),

  // ---------- Retail & Shopping ----------
  'Sales Executive': r('Promote and sell products to customers and meet sales targets.', ['Communication', 'Negotiation', 'Product knowledge', 'Customer handling', 'Target orientation'], 'Intermediate / Any graduate', 'Fresher - 3 years', '₹14,000 - ₹28,000 / month (approx.)'),
  'Store Manager': r('Run daily store operations, staff, stock and sales performance.', ['Team management', 'Inventory control', 'Sales planning', 'Customer handling', 'Problem solving'], 'Graduate preferred', '3-6 years', '₹25,000 - ₹45,000 / month (approx.)'),
  'Customer Support Executive': r('Answer customer queries by phone, chat or email and resolve issues.', ['Communication', 'Telugu / Hindi / English', 'Typing', 'Problem solving', 'Patience'], 'Intermediate / Any graduate', 'Fresher - 2 years', '₹13,000 - ₹24,000 / month (approx.)'),
  'Inventory Assistant': r('Track stock, receive goods and keep inventory records up to date.', ['Stock counting', 'Basic computer skills', 'Organization', 'Accuracy', 'Record keeping'], '10th / Intermediate', 'Fresher - 2 years', '₹12,000 - ₹20,000 / month (approx.)'),
  'Retail Associate': r('Assist shoppers on the floor, arrange shelves and handle billing.', ['Customer service', 'Product display', 'Billing', 'Teamwork', 'Basic maths'], '10th / Intermediate', 'Fresher - 2 years', '₹12,000 - ₹20,000 / month (approx.)'),
  'Store Supervisor': r('Supervise store staff, shifts and daily floor operations.', ['Supervision', 'Customer handling', 'Stock checking', 'Scheduling', 'Communication'], 'Intermediate / Graduate', '2-4 years', '₹18,000 - ₹30,000 / month (approx.)'),

  // ---------- Logistics & Delivery ----------
  'Delivery Executive': r('Deliver parcels and orders on time within an assigned area.', ['Two-wheeler riding', 'Route knowledge', 'Smartphone use', 'Time management', 'Customer handling'], '10th pass; valid driving licence', 'Fresher', '₹15,000 - ₹28,000 / month (approx.)'),
  'Warehouse Assistant': r('Load, unload, sort and store goods in a warehouse.', ['Physical stamina', 'Stock handling', 'Basic counting', 'Safety awareness', 'Teamwork'], '10th pass', 'Fresher - 2 years', '₹12,000 - ₹20,000 / month (approx.)'),
  'Logistics Coordinator': r('Coordinate shipments, vehicles and delivery schedules.', ['Planning', 'MS Excel', 'Communication', 'Tracking systems', 'Problem solving'], 'Any graduate', '1-3 years', '₹18,000 - ₹30,000 / month (approx.)'),
  'Driver': r('Drive company or goods vehicles safely along assigned routes.', ['Valid driving licence', 'Route knowledge', 'Vehicle care', 'Time management', 'Safe driving'], '10th pass; commercial licence for heavy vehicles', '1-5 years', '₹14,000 - ₹28,000 / month (approx.)'),
  'Inventory Executive': r('Manage stock levels, audits and inventory reports.', ['Inventory software', 'MS Excel', 'Stock audit', 'Accuracy', 'Reporting'], 'Graduate / Intermediate', '1-3 years', '₹15,000 - ₹26,000 / month (approx.)'),
  'Fleet Supervisor': r('Supervise drivers, vehicle schedules and maintenance records.', ['Fleet management', 'Scheduling', 'Team supervision', 'Vehicle maintenance knowledge', 'Reporting'], 'Graduate / Diploma preferred', '3-6 years', '₹22,000 - ₹40,000 / month (approx.)'),

  // ---------- Security Services ----------
  'Security Guard': r('Guard premises, control entry and report incidents.', ['Alertness', 'Physical fitness', 'Visitor management', 'Discipline', 'Basic communication'], '10th pass', 'Fresher - 2 years', '₹12,000 - ₹18,000 / month (approx.)'),
  'Security Supervisor': r('Supervise guards, shifts and security procedures on site.', ['Team supervision', 'Incident handling', 'Scheduling', 'Report writing', 'Discipline'], '10th / 12th pass; ex-servicemen preferred', '2-5 years', '₹16,000 - ₹26,000 / month (approx.)'),
  'CCTV Operator': r('Monitor camera feeds and report suspicious activity.', ['Attention to detail', 'Basic computer skills', 'Monitoring systems', 'Incident reporting', 'Patience'], 'Intermediate', 'Fresher - 2 years', '₹12,000 - ₹20,000 / month (approx.)'),
  'Security Officer': r('Manage security operations and enforce safety rules at a site.', ['Security procedures', 'Emergency response', 'Report writing', 'Leadership', 'Communication'], 'Graduate / ex-servicemen preferred', '3-6 years', '₹20,000 - ₹35,000 / month (approx.)'),
  'Event Security Staff': r('Handle crowd control and entry checks during events.', ['Crowd handling', 'Alertness', 'Physical fitness', 'Communication', 'Discipline'], '10th pass', 'Fresher - 2 years', '₹800 - ₹1,500 / day (approx.)', 'Temporary'),

  // ---------- Construction & Skilled Trades ----------
  'Electrician': r('Install, repair and maintain electrical wiring and equipment.', ['Wiring', 'Circuit testing', 'Safety practices', 'Fault finding', 'Tool handling'], 'ITI Electrician / Diploma', '1-5 years', '₹15,000 - ₹30,000 / month (approx.)'),
  'Plumber': r('Install and repair pipes, fittings and water systems.', ['Pipe fitting', 'Leak repair', 'Tool handling', 'Problem solving', 'Safety practices'], 'ITI Plumber / experience-based', '1-5 years', '₹14,000 - ₹26,000 / month (approx.)'),
  'Site Supervisor': r('Supervise workers, materials and daily progress at a construction site.', ['Site management', 'Reading drawings', 'Team supervision', 'Safety rules', 'Reporting'], 'Diploma in Civil / experience-based', '3-6 years', '₹22,000 - ₹40,000 / month (approx.)'),
  'Civil Engineer': r('Plan, design and oversee construction and civil projects.', ['AutoCAD', 'Structural basics', 'Estimation', 'Site supervision', 'Project planning'], 'B.Tech / Diploma in Civil Engineering', '1-5 years', '₹3.5 - ₹8 LPA (approx.)'),
  'Welder': r('Join and fabricate metal parts using welding techniques.', ['Arc / MIG welding', 'Blueprint reading', 'Safety practices', 'Metal fabrication', 'Precision'], 'ITI Welder / experience-based', '1-5 years', '₹15,000 - ₹28,000 / month (approx.)'),
  'Carpenter': r('Build, fit and repair wooden structures and furniture.', ['Wood cutting & joinery', 'Measurement', 'Tool handling', 'Furniture fitting', 'Finishing work'], 'Experience-based; ITI preferred', '1-5 years', '₹14,000 - ₹26,000 / month (approx.)'),
  'Construction Helper': r('Assist skilled workers with materials, cleaning and site tasks.', ['Physical stamina', 'Following instructions', 'Material handling', 'Safety awareness', 'Teamwork'], 'No minimum qualification', 'Fresher', '₹600 - ₹900 / day (approx.)', 'Temporary / Full-time'),

  // ---------- Office & Administration ----------
  'Office Assistant': r('Support daily office work including filing, errands and coordination.', ['Filing & documentation', 'Basic computer skills', 'Communication', 'Organization', 'Reliability'], '10th / Intermediate', 'Fresher - 2 years', '₹10,000 - ₹18,000 / month (approx.)'),
  'Data Entry Operator': r('Enter and update data accurately in computer systems.', ['Typing speed', 'MS Excel', 'Accuracy', 'Attention to detail', 'Basic computer skills'], 'Intermediate / Any graduate', 'Fresher - 2 years', '₹10,000 - ₹18,000 / month (approx.)'),
  'HR Executive': r('Handle recruitment coordination, attendance and employee records.', ['Communication', 'Recruitment basics', 'MS Excel', 'Documentation', 'Interpersonal skills'], 'BBA / MBA HR / Any graduate', '0-3 years', '₹15,000 - ₹30,000 / month (approx.)'),
  'Administrative Assistant': r('Provide administrative support including schedules, documents and records.', ['MS Office', 'Communication', 'Scheduling', 'Documentation', 'Time management'], 'Any graduate', '1-3 years', '₹14,000 - ₹26,000 / month (approx.)'),
};

export const getRoleInfo = (role: string): RoleInfo =>
  ROLE_INFO[role] ||
  r(
    'Demo details for this role will be added soon.',
    ['Communication', 'Teamwork'],
    'As per employer requirement',
    'Fresher / Experienced',
    'Varies by employer'
  );
