
        // Default list of 25 custom agents
        const defaultAgents = [
            { id: 1, vertical: "Customer Support", name: "Customer FAQ Bot", dailyRequests: 12000, inputTokens: 1500, outputTokens: 500 },
            { id: 2, vertical: "Customer Support", name: "Refund & Returns Processor", dailyRequests: 5000, inputTokens: 3000, outputTokens: 800 },
            { id: 3, vertical: "Customer Support", name: "Escalation Triager", dailyRequests: 3000, inputTokens: 2000, outputTokens: 400 },
            { id: 4, vertical: "IT & Tech Support", name: "SysAdmin Ticket Resolver", dailyRequests: 4000, inputTokens: 4000, outputTokens: 1000 },
            { id: 5, vertical: "IT & Tech Support", name: "Access & Provisioning Bot", dailyRequests: 2500, inputTokens: 2000, outputTokens: 500 },
            { id: 6, vertical: "IT & Tech Support", name: "Knowledge Base Searcher", dailyRequests: 3500, inputTokens: 3000, outputTokens: 1200 },
            { id: 7, vertical: "Sales & Marketing", name: "Lead Qualifier & Scraper", dailyRequests: 4500, inputTokens: 5000, outputTokens: 800 },
            { id: 8, vertical: "Sales & Marketing", name: "Brand Copywriter (Blog/Social)", dailyRequests: 2000, inputTokens: 4000, outputTokens: 1500 },
            { id: 9, vertical: "Sales & Marketing", name: "RFP Response Generator", dailyRequests: 1000, inputTokens: 15000, outputTokens: 3000 },
            { id: 10, vertical: "Human Resources", name: "Benefits & Policy Advisor", dailyRequests: 3000, inputTokens: 3500, outputTokens: 800 },
            { id: 11, vertical: "Human Resources", name: "Resume screener & Evaluator", dailyRequests: 1500, inputTokens: 8000, outputTokens: 1500 },
            { id: 12, vertical: "Human Resources", name: "Employee Onboarder bot", dailyRequests: 1200, inputTokens: 4000, outputTokens: 800 },
            { id: 13, vertical: "Legal & Compliance", name: "NDA Risk Scanner", dailyRequests: 800, inputTokens: 25000, outputTokens: 2000 },
            { id: 14, vertical: "Legal & Compliance", name: "Compliance Policy Auditor", dailyRequests: 600, inputTokens: 30000, outputTokens: 3500 },
            { id: 15, vertical: "Finance & Procurement", name: "Expense Report Auditor", dailyRequests: 2500, inputTokens: 5000, outputTokens: 1000 },
            { id: 16, vertical: "Finance & Procurement", name: "Vendor Quote Comparison", dailyRequests: 1000, inputTokens: 12000, outputTokens: 2000 },
            { id: 17, vertical: "Product & Eng", name: "Pull Request Reviewer", dailyRequests: 3000, inputTokens: 12000, outputTokens: 1500 },
            { id: 18, vertical: "Product & Eng", name: "Jira Bug Explainer", dailyRequests: 2000, inputTokens: 6000, outputTokens: 1000 },
            { id: 19, vertical: "Product & Eng", name: "PRD Writer Assistant", dailyRequests: 800, inputTokens: 8000, outputTokens: 2000 },
            { id: 20, vertical: "Operations", name: "Inventory Alert & Reorder bot", dailyRequests: 1500, inputTokens: 4000, outputTokens: 600 },
            { id: 21, vertical: "Operations", name: "Logistics Route Optimizer", dailyRequests: 1200, inputTokens: 5000, outputTokens: 1200 },
            { id: 22, vertical: "Data Analytics", name: "SQL Query Generator", dailyRequests: 4000, inputTokens: 6000, outputTokens: 800 },
            { id: 23, vertical: "Data Analytics", name: "Metric Report Summarizer", dailyRequests: 1800, inputTokens: 10000, outputTokens: 1500 },
            { id: 24, vertical: "Strategy & Exec", name: "Market Intelligence Brief", dailyRequests: 500, inputTokens: 20000, outputTokens: 2500 },
            { id: 25, vertical: "Strategy & Exec", name: "Meeting Action Item Extractor", dailyRequests: 1200, inputTokens: 15000, outputTokens: 1200 }
        ];

        // Token consumption daily assumptions per user category
        const tokenAssumptions = {
            agentic: {
                power: { uncached: 4800000, cached: 49600000, output: 480000 },
                pro: { uncached: 1440000, cached: 10080000, output: 192000 },
                business: { uncached: 76000, cached: 228000, output: 15200 }
            },
            standard: {
                power: { uncached: 600000, cached: 6200000, output: 60000 },
                pro: { uncached: 360000, cached: 252000, output: 48000 },
                business: { uncached: 50000, cached: 150000, output: 10000 }
            }
        };

        // State Manager
        let state = {
            agents: JSON.parse(JSON.stringify(defaultAgents)),
            seats: 1000,
            geminiSeatPrice: 30,
            geminiPlusSeatPrice: 50,
            claudeSeatPrice: 20, // New $20 / user / month license fee for Claude Enterprise
            edition: 'std', // 'std' or 'plus'
            activeFilter: 'All',
            searchQuery: '',
            rates: {
                claude48: { in: 5.0, out: 25.0 },
                sonnet46: { in: 3.0, out: 15.0 }
            },
            codeAssistValue: 3762,
            chatgptModel: 'gpt54',
            claudeModel: 'opus',

            chatgptCreditPrice: 0.035,
            chatgptMinCredits: 200,
            chatgptRates: {
                gpt55: { in: 125.00, out: 750.00 },
                gpt54: { in: 62.50, out: 375.00 }
            },
            workloadMode: 'agentic',
            usersPower: 100,
            usersPro: 250,
            usersBusiness: 500,
            geminiAgentPricingMode: 'as-is',
            isApplyingPreset: false,
            selectedAgentIds: new Set()
        };

        // Cache elements
        const sliderSeats = document.getElementById('slider-seats');
        const lblSeats = document.getElementById('lbl-seats');
        
        // Workload Config Panel Elements
        const sliderWorkloadPower = document.getElementById('slider-workload-power');
        const lblWorkloadPower = document.getElementById('lbl-workload-power');
        const sliderWorkloadPro = document.getElementById('slider-workload-pro');
        const lblWorkloadPro = document.getElementById('lbl-workload-pro');
        const sliderWorkloadBusiness = document.getElementById('slider-workload-business');
        const lblWorkloadBusiness = document.getElementById('lbl-workload-business');

        // Card breakdown workload volume labels
        const lblHeroOpusUserTokensVol = document.getElementById('lbl-hero-opus-user-tokens-vol');
        const lblHeroSonnetUserTokensVol = document.getElementById('lbl-hero-sonnet-user-tokens-vol');

        const inputGeminiPrice = document.getElementById('input-gemini-price');
        const inputGeminiPlusPrice = document.getElementById('input-gemini-plus-price');
        const inputClaudeSeatPrice = document.getElementById('input-claude-seat-price');
        
        // Config rate input definitions remain
        const inputRateClaudeIn = document.getElementById('input-rate-claude-in');
        const inputRateClaudeOut = document.getElementById('input-rate-claude-out');
        const inputRateSonnetIn = document.getElementById('input-rate-sonnet-in');
        const inputRateSonnetOut = document.getElementById('input-rate-sonnet-out');

        const inputChatgptCreditPrice = document.getElementById('input-chatgpt-credit-price');
        const inputChatgptMinCredits = document.getElementById('input-chatgpt-min-credits');
        const inputRateGpt55In = document.getElementById('input-rate-gpt55-in');
        const inputRateGpt55Out = document.getElementById('input-rate-gpt55-out');
        const inputRateGpt54In = document.getElementById('input-rate-gpt54-in');
        const inputRateGpt54Out = document.getElementById('input-rate-gpt54-out');
        
        // Remove standard/plus select elements since buttons were removed from HTML
        
        // Hero Pricing Section Centers
        const lblHeroGeminiTitle = document.getElementById('lbl-hero-gemini-title');
        const lblHeroGeminiStdCost = document.getElementById('lbl-hero-gemini-std-cost');
        const lblHeroGeminiPlusCost = document.getElementById('lbl-hero-gemini-plus-cost');
        const lblHeroGeminiStdBreakdown = document.getElementById('lbl-hero-gemini-std-breakdown');
        const lblHeroGeminiPlusBreakdown = document.getElementById('lbl-hero-gemini-plus-breakdown');
        const lblHeroGeminiStdAgentCost = document.getElementById('lbl-hero-gemini-std-agent-cost');
        const lblHeroGeminiPlusAgentCost = document.getElementById('lbl-hero-gemini-plus-agent-cost');
        const lblHeroGeminiStdBadgeNote = document.getElementById('lbl-hero-gemini-std-badge-note');
        const lblHeroGeminiPlusBadgeNote = document.getElementById('lbl-hero-gemini-plus-badge-note');
        const lblHeroGeminiStdAgentTokens = document.getElementById('lbl-hero-gemini-std-agent-tokens');
        const lblHeroGeminiPlusAgentTokens = document.getElementById('lbl-hero-gemini-plus-agent-tokens');
        const lblHeroGeminiStdUserWorkloadTitle = document.getElementById('lbl-hero-gemini-std-user-workload-title');
        const lblHeroGeminiStdUserWorkloadCost = document.getElementById('lbl-hero-gemini-std-user-workload-cost');
        const lblHeroGeminiPlusUserWorkloadTitle = document.getElementById('lbl-hero-gemini-plus-user-workload-title');
        const lblHeroGeminiPlusUserWorkloadCost = document.getElementById('lbl-hero-gemini-plus-user-workload-cost');
        
        const lblHeroClaudeCost = document.getElementById('lbl-hero-claude-cost');
        const lblHeroClaudeSubCost = document.getElementById('lbl-hero-claude-sub-cost');
        const claudeOpusBreakdownGroup = document.getElementById('claude-opus-breakdown-group');
        const claudeSonnetBreakdownGroup = document.getElementById('claude-sonnet-breakdown-group');

        const lblHeroSonnetLicBreakdown = document.getElementById('lbl-hero-sonnet-lic-breakdown');
        const lblHeroSonnetApiBreakdown = document.getElementById('lbl-hero-sonnet-api-breakdown');

        const lblHeroClaudeLicBreakdown = document.getElementById('lbl-hero-claude-lic-breakdown');
        const lblHeroClaudeApiBreakdown = document.getElementById('lbl-hero-claude-api-breakdown');


        // ChatGPT DOM Elements
        const lblHeroChatgptCost = document.getElementById('lbl-hero-chatgpt-cost');
        const lblHeroChatgptMinBreakdown = document.getElementById('lbl-hero-chatgpt-min-breakdown');
        const lblHeroChatgptAgentCredits = document.getElementById('lbl-hero-chatgpt-agent-credits');
        const lblHeroChatgptAgentBreakdown = document.getElementById('lbl-hero-chatgpt-agent-breakdown');
        const lblHeroChatgptCodingCredits = document.getElementById('lbl-hero-chatgpt-coding-credits');
        const lblHeroChatgptCodingBreakdown = document.getElementById('lbl-hero-chatgpt-coding-breakdown');
        const lblHeroChatgptTotalCredits = document.getElementById('lbl-hero-chatgpt-total-credits');

        // Quotas indicators
        const lblQuotaProgressPct = document.getElementById('lbl-quota-progress-pct');
        const lblQuotaNumbers = document.getElementById('lbl-quota-numbers');
        const quotaBar = document.getElementById('quota-bar');
        const lblQuotaLimitNote = document.getElementById('lbl-quota-limit-note');
        const quotaWarningBanner = document.getElementById('quota-warning-banner');

        // ROI values
        const lblRoiCardTitle = document.getElementById('lbl-roi-card-title');
        const lblRoiRatio = document.getElementById('lbl-roi-ratio');
        const lblRoiAssistant = document.getElementById('lbl-roi-assistant');
        const lblRoiStorage = document.getElementById('lbl-roi-storage');
        const lblRoiStorageLabel = document.getElementById('lbl-roi-storage-label');
        const lblRoiDeepResearch = document.getElementById('lbl-roi-deepresearch');
        const lblRoiDeepResearchLabel = document.getElementById('lbl-roi-deepresearch-label');
        const lblRoiVideo = document.getElementById('lbl-roi-video');
        const lblRoiVideoLabel = document.getElementById('lbl-roi-video-label');
        const lblRoiImage = document.getElementById('lbl-roi-image');
        const lblRoiImageLabel = document.getElementById('lbl-roi-image-label');
        const lblRoiTotalValue = document.getElementById('lbl-roi-total-value');

        const inputSearch = document.getElementById('input-search');
        const filterTabs = document.getElementById('filter-tabs');
        
        const valSummaryCount = document.getElementById('val-summary-count');
        const valSummaryRequests = document.getElementById('val-summary-requests');
        const valSummaryInput = document.getElementById('val-summary-input');
        const valSummaryOutput = document.getElementById('val-summary-output');
        
        const agentTableBody = document.getElementById('agent-table-body');
        const btnAddAgent = document.getElementById('btn-add-agent');
        const btnReset = document.getElementById('btn-reset');
        
        // Multi-agent selection elements
        const chkSelectAll = document.getElementById('chk-select-all');
        const btnDeleteSelected = document.getElementById('btn-delete-selected');
        const deleteSelectedCount = document.getElementById('delete-selected-count');

        // Form fields for adding an agent
        const addVertical = document.getElementById('add-vertical');
        const addName = document.getElementById('add-name');
        const addRequests = document.getElementById('add-requests');
        const addInput = document.getElementById('add-input');
        const addOutput = document.getElementById('add-output');

        // Clamp user workloads to never exceed total organization seats
        function clampWorkloads(changedSlider) {
            let power = parseInt(sliderWorkloadPower.value) || 0;
            let pro = parseInt(sliderWorkloadPro.value) || 0;
            let business = parseInt(sliderWorkloadBusiness.value) || 0;
            
            const totalSeats = parseInt(sliderSeats.value) || 10;
            
            if (changedSlider === 'power') {
                if (power + pro + business > totalSeats) {
                    power = totalSeats - pro - business;
                    if (power < 0) power = 0;
                    sliderWorkloadPower.value = power;
                }
            } else if (changedSlider === 'pro') {
                if (power + pro + business > totalSeats) {
                    pro = totalSeats - power - business;
                    if (pro < 0) pro = 0;
                    sliderWorkloadPro.value = pro;
                }
            } else if (changedSlider === 'business') {
                if (power + pro + business > totalSeats) {
                    business = totalSeats - power - pro;
                    if (business < 0) business = 0;
                    sliderWorkloadBusiness.value = business;
                }
            } else if (changedSlider === 'seats') {
                // Dynamically update the max bounds of individual sliders so they cannot go beyond seats
                sliderWorkloadPower.max = totalSeats;
                sliderWorkloadPro.max = totalSeats;
                sliderWorkloadBusiness.max = totalSeats;
                
                let sum = power + pro + business;
                if (sum > totalSeats) {
                    if (sum === 0) {
                        power = pro = business = 0;
                    } else {
                        // Scale down proportionally to fit the new seats limit
                        const scale = totalSeats / sum;
                        power = Math.floor(power * scale);
                        pro = Math.floor(pro * scale);
                        business = Math.floor(business * scale);
                        // Handle rounding discrepancies
                        let newSum = power + pro + business;
                        let diff = totalSeats - newSum;
                        if (diff > 0) {
                            business += diff;
                        }
                    }
                    sliderWorkloadPower.value = power;
                    sliderWorkloadPro.value = pro;
                    sliderWorkloadBusiness.value = business;
                }
            }
        }

        // Initial setup
        function init() {
            attachEventListeners();
            // Initialize max bounds of sliders
            const totalSeats = parseInt(sliderSeats.value) || 1000;
            sliderWorkloadPower.max = totalSeats;
            sliderWorkloadPro.max = totalSeats;
            sliderWorkloadBusiness.max = totalSeats;
            
            // Set Custom as initially active preset on load
            applyPreset('custom');
        }

        function setDetailsEdition(edition) {
            state.edition = edition;
            
            const btnStd = document.getElementById('btn-toggle-std');
            const btnPlus = document.getElementById('btn-toggle-plus');
            
            if (btnStd && btnPlus) {
                if (edition === 'plus') {
                    btnStd.classList.remove('active');
                    btnPlus.classList.add('active');
                } else {
                    btnPlus.classList.remove('active');
                    btnStd.classList.add('active');
                }
            }
            
            calculateAll();
        }
        window.setDetailsEdition = setDetailsEdition;

        function setChatgptModel(model) {
            state.chatgptModel = model;
            
            const btn54 = document.getElementById('btn-chatgpt-model-54');
            const btn55 = document.getElementById('btn-chatgpt-model-55');
            
            if (btn54 && btn55) {
                if (model === 'gpt55') {
                    btn54.classList.remove('active');
                    btn55.classList.add('active');
                } else {
                    btn55.classList.remove('active');
                    btn54.classList.add('active');
                }
            }
            
            calculateAll();
        }
        window.setChatgptModel = setChatgptModel;

        function clearPresetActiveStates() {
            const pills = document.querySelectorAll('.preset-pill');
            pills.forEach(pill => {
                if (pill.getAttribute('data-preset') === 'custom') {
                    pill.classList.add('active');
                } else {
                    pill.classList.remove('active');
                }
            });
        }
        window.clearPresetActiveStates = clearPresetActiveStates;

        function applyPreset(presetName) {
            let seats, power, pro, business;
            let numAgents = 25;
            if (presetName === 'midmarket') {
                seats = 250;
                power = 25;
                pro = 75;
                business = 150;
                numAgents = 5;
            } else if (presetName === 'enterprise') {
                seats = 5000;
                power = 500;
                pro = 1500;
                business = 3000;
                numAgents = 25;
            } else if (presetName === 'global') {
                seats = 25000;
                power = 2500;
                pro = 7500;
                business = 15000;
                numAgents = 50;
            } else if (presetName === 'custom') {
                seats = 1000;
                power = 100;
                pro = 300;
                business = 600;
                numAgents = 25;
            } else {
                return;
            }

            // Set flag to prevent resetting active states programmatically
            state.isApplyingPreset = true;

            // 1. Update sliders and trigger input & change events
            sliderSeats.value = seats;
            sliderSeats.dispatchEvent(new Event('input'));
            sliderSeats.dispatchEvent(new Event('change'));

            sliderWorkloadPower.value = power;
            sliderWorkloadPro.value = pro;
            sliderWorkloadBusiness.value = business;

            sliderWorkloadPower.dispatchEvent(new Event('input'));
            sliderWorkloadPower.dispatchEvent(new Event('change'));
            
            sliderWorkloadPro.dispatchEvent(new Event('input'));
            sliderWorkloadPro.dispatchEvent(new Event('change'));
            
            sliderWorkloadBusiness.dispatchEvent(new Event('input'));
            sliderWorkloadBusiness.dispatchEvent(new Event('change'));

            // 2. Adjust pricing inputs to default as part of preset baseline
            inputGeminiPrice.value = 30;
            inputGeminiPlusPrice.value = 50;
            inputGeminiPrice.dispatchEvent(new Event('input'));
            inputGeminiPlusPrice.dispatchEvent(new Event('input'));

            // 3. Build preset-specific list from default agents and scale them
            let baseAgents = [];
            if (numAgents <= defaultAgents.length) {
                baseAgents = defaultAgents.slice(0, numAgents);
            } else {
                baseAgents = [...defaultAgents];
                let additionalNeeded = numAgents - defaultAgents.length;
                for (let i = 0; i < additionalNeeded; i++) {
                    const original = defaultAgents[i % defaultAgents.length];
                    baseAgents.push({
                        ...original,
                        id: defaultAgents.length + i + 1,
                        name: `${original.name} (${String.fromCharCode(66 + Math.floor(i / defaultAgents.length))})`
                    });
                }
            }

            const scaleFactor = seats / 1000;
            state.agents = baseAgents.map(agent => ({
                ...agent,
                dailyRequests: Math.round(agent.dailyRequests * scaleFactor)
            }));

            // Re-render table and trigger final recalculation
            renderAgentTable();
            calculateAll();

            // Clear applying flag
            state.isApplyingPreset = false;

            // 4. Update preset active class states
            const pills = document.querySelectorAll('.preset-pill');
            pills.forEach(pill => {
                if (pill.getAttribute('data-preset') === presetName) {
                    pill.classList.add('active');
                } else {
                    pill.classList.remove('active');
                }
            });
        }
        window.applyPreset = applyPreset;

        function setWorkloadMode(mode) {
            state.workloadMode = mode;
            
            const btnAgentic = document.getElementById('btn-workload-agentic');
            const btnStandard = document.getElementById('btn-workload-standard');
            
            if (btnAgentic && btnStandard) {
                if (mode === 'agentic') {
                    btnStandard.classList.remove('active');
                    btnAgentic.classList.add('active');
                } else {
                    btnAgentic.classList.remove('active');
                    btnStandard.classList.add('active');
                }
            }
            
            calculateAll();
        }
        window.setWorkloadMode = setWorkloadMode;

        function setGeminiAgentPricing(mode) {
            state.geminiAgentPricingMode = mode;
            
            const btnAsIs = document.getElementById('btn-gemini-agent-as-is');
            const btnFlash = document.getElementById('btn-gemini-agent-flash');
            
            if (btnAsIs && btnFlash) {
                if (mode === 'flash') {
                    btnAsIs.classList.remove('active');
                    btnFlash.classList.add('active');
                } else {
                    btnFlash.classList.remove('active');
                    btnAsIs.classList.add('active');
                }
            }
            
            calculateAll();
        }
        window.setGeminiAgentPricing = setGeminiAgentPricing;

        function setClaudeModel(model) {

            state.claudeModel = model;
            
            const btnOpus = document.getElementById('btn-claude-model-opus');
            const btnSonnet = document.getElementById('btn-claude-model-sonnet');
            
            if (btnOpus && btnSonnet) {
                if (model === 'sonnet') {
                    btnOpus.classList.remove('active');
                    btnSonnet.classList.add('active');
                } else {
                    btnSonnet.classList.remove('active');
                    btnOpus.classList.add('active');
                }
            }
            
            calculateAll();
        }
        window.setClaudeModel = setClaudeModel;





        function formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function formatTokenMetric(tokens) {
            if (tokens >= 1000000000000) {
                return (tokens / 1000000000000).toFixed(1) + "T";
            } else if (tokens >= 1000000000) {
                return (tokens / 1000000000).toFixed(1) + "B";
            } else if (tokens >= 1000000) {
                return (tokens / 1000000).toFixed(1) + "M";
            } else {
                return formatNumber(tokens);
            }
        }

        // Calculation & updating engine
        function calculateAll() {
            // Update seats & licensing parameters
            state.seats = parseInt(sliderSeats.value);
            lblSeats.textContent = formatNumber(state.seats);
            state.geminiSeatPrice = parseFloat(inputGeminiPrice.value) || 0;
            state.geminiPlusSeatPrice = parseFloat(inputGeminiPlusPrice.value) || 0;
            state.claudeSeatPrice = parseFloat(inputClaudeSeatPrice.value) || 0;

            // Update workload parameters
            state.usersPower = parseInt(sliderWorkloadPower.value) || 0;
            state.usersPro = parseInt(sliderWorkloadPro.value) || 0;
            state.usersBusiness = parseInt(sliderWorkloadBusiness.value) || 0;

            lblWorkloadPower.textContent = formatNumber(state.usersPower);
            lblWorkloadPro.textContent = formatNumber(state.usersPro);
            lblWorkloadBusiness.textContent = formatNumber(state.usersBusiness);

            // Recalculate dynamic user pricing rates
            state.rates.claude48.in = parseFloat(inputRateClaudeIn.value) || 0;
            state.rates.claude48.out = parseFloat(inputRateClaudeOut.value) || 0;
            state.rates.sonnet46.in = parseFloat(inputRateSonnetIn.value) || 0;
            state.rates.sonnet46.out = parseFloat(inputRateSonnetOut.value) || 0;

            state.chatgptCreditPrice = parseFloat(inputChatgptCreditPrice.value) || 0;
            state.chatgptMinCredits = parseFloat(inputChatgptMinCredits.value) || 0;
            state.chatgptRates.gpt55.in = parseFloat(inputRateGpt55In.value) || 0;
            state.chatgptRates.gpt55.out = parseFloat(inputRateGpt55Out.value) || 0;
            state.chatgptRates.gpt54.in = parseFloat(inputRateGpt54In.value) || 0;
            state.chatgptRates.gpt54.out = parseFloat(inputRateGpt54Out.value) || 0;

            // Totals across active modeler agents
            let totalRequests = 0;
            let totalInputTokens = 0;
            let totalOutputTokens = 0;

            state.agents.forEach(agent => {
                totalRequests += agent.dailyRequests;
                totalInputTokens += agent.dailyRequests * agent.inputTokens;
                totalOutputTokens += agent.dailyRequests * agent.outputTokens;
            });

            // Update workload aggregations bar
            valSummaryCount.textContent = state.agents.length;
            valSummaryRequests.textContent = formatNumber(totalRequests);
            valSummaryInput.textContent = formatTokenMetric(totalInputTokens);
            valSummaryOutput.textContent = formatTokenMetric(totalOutputTokens);

            // Update all dynamic-agents-count spans in descriptions and cards
            const countSpans = document.querySelectorAll('.dynamic-agents-count');
            countSpans.forEach(span => {
                span.textContent = state.agents.length;
            });

            // 1. DYNAMIC USER WORKLOADS MATH (uncached, cached, output)
            const mode = state.workloadMode || 'agentic';
            const assumptions = tokenAssumptions[mode];

            const dailyUncached = (state.usersPower * assumptions.power.uncached) +
                                  (state.usersPro * assumptions.pro.uncached) +
                                  (state.usersBusiness * assumptions.business.uncached);

            const dailyCached = (state.usersPower * assumptions.power.cached) +
                                (state.usersPro * assumptions.pro.cached) +
                                (state.usersBusiness * assumptions.business.cached);

            const dailyOutput = (state.usersPower * assumptions.power.output) +
                                (state.usersPro * assumptions.pro.output) +
                                (state.usersBusiness * assumptions.business.output);

            const monthlyUncached = dailyUncached * 30;
            const monthlyCached = dailyCached * 30;
            const monthlyOutput = dailyOutput * 30;

            const totalUserWorkloadsTokens = monthlyUncached + monthlyCached + monthlyOutput;

            // 2. GEMINI COST METRICS (Standard and Plus tiers with Included User Workloads & overages)
            const monthlyGeminiAgentCost = state.geminiAgentPricingMode === 'flash' 
                ? Math.round(((totalInputTokens * 1.50) + (totalOutputTokens * 9.00)) / 1000000 * 30) 
                : 0;

            // Gemini Included User Workloads (1,500 req/day per user @ 50k tokens/req = 75M tokens/day per user)
            // Limit splits: 14.5% uncached input, 84.5% cached input, 1% output
            const dailyUncachedLimit = state.seats * 75000000 * 0.145;
            const dailyCachedLimit = state.seats * 75000000 * 0.845;
            const dailyOutputLimit = state.seats * 75000000 * 0.01;

            const overageUncached = Math.max(0, dailyUncached - dailyUncachedLimit);
            const overageCached = Math.max(0, dailyCached - dailyCachedLimit);
            const overageOutput = Math.max(0, dailyOutput - dailyOutputLimit);

            // Gemini 3.5 Flash Overage Rates
            const rateUncached = 0.075 / 1000000;  // $0.075 per 1M tokens
            const rateCached = 0.01875 / 1000000;  // $0.01875 per 1M tokens (75% cached discount)
            const rateOutput = 0.30 / 1000000;     // $0.30 per 1M tokens

            const dailyOverageCost = (overageUncached * rateUncached) + 
                                     (overageCached * rateCached) + 
                                     (overageOutput * rateOutput);
            
            const monthlyGeminiUserOverageCost = Math.round(dailyOverageCost * 30);

            const geminiStdTotal = (state.seats * state.geminiSeatPrice) + monthlyGeminiAgentCost + monthlyGeminiUserOverageCost;
            const geminiPlusTotal = (state.seats * state.geminiPlusSeatPrice) + monthlyGeminiAgentCost + monthlyGeminiUserOverageCost;
            
            lblHeroGeminiStdCost.textContent = "$" + formatNumber(Math.round(geminiStdTotal));
            lblHeroGeminiPlusCost.textContent = "$" + formatNumber(Math.round(geminiPlusTotal));
            
            lblHeroGeminiStdBreakdown.textContent = "$" + formatNumber(Math.round(state.seats * state.geminiSeatPrice));
            lblHeroGeminiPlusBreakdown.textContent = "$" + formatNumber(Math.round(state.seats * state.geminiPlusSeatPrice));

            if (lblHeroGeminiStdAgentCost && lblHeroGeminiPlusAgentCost) {
                if (state.geminiAgentPricingMode === 'flash') {
                    lblHeroGeminiStdAgentCost.textContent = "$" + formatNumber(monthlyGeminiAgentCost);
                    lblHeroGeminiStdAgentCost.style.color = 'black';
                    lblHeroGeminiPlusAgentCost.textContent = "$" + formatNumber(monthlyGeminiAgentCost);
                    lblHeroGeminiPlusAgentCost.style.color = 'black';
                } else {
                    lblHeroGeminiStdAgentCost.textContent = "$0.00 (Included)";
                    lblHeroGeminiStdAgentCost.style.color = '#0f9d58';
                    lblHeroGeminiPlusAgentCost.textContent = "$0.00 (Included)";
                    lblHeroGeminiPlusAgentCost.style.color = '#0f9d58';
                }
            }

            // Update Included User Workloads Label with Total Free Tokens getting overall
            const totalFreeTokensMonth = state.seats * 75000000 * 30;
            const formattedFreeTokens = formatTokenMetric(totalFreeTokensMonth);

            if (lblHeroGeminiStdUserWorkloadTitle) {
                lblHeroGeminiStdUserWorkloadTitle.textContent = "3. Free Included Tokens** (" + formattedFreeTokens + "/mo):";
            }
            if (lblHeroGeminiPlusUserWorkloadTitle) {
                lblHeroGeminiPlusUserWorkloadTitle.textContent = "3. Free Included Tokens** (" + formattedFreeTokens + "/mo):";
            }

            if (lblHeroGeminiStdUserWorkloadCost) {
                if (monthlyGeminiUserOverageCost > 0) {
                    lblHeroGeminiStdUserWorkloadCost.textContent = "+$" + formatNumber(monthlyGeminiUserOverageCost) + " (Overage)";
                    lblHeroGeminiStdUserWorkloadCost.style.color = '#ff6b6b';
                } else {
                    lblHeroGeminiStdUserWorkloadCost.textContent = "$0.00 (Included)";
                    lblHeroGeminiStdUserWorkloadCost.style.color = '#0f9d58';
                }
            }
            if (lblHeroGeminiPlusUserWorkloadCost) {
                if (monthlyGeminiUserOverageCost > 0) {
                    lblHeroGeminiPlusUserWorkloadCost.textContent = "+$" + formatNumber(monthlyGeminiUserOverageCost) + " (Overage)";
                    lblHeroGeminiPlusUserWorkloadCost.style.color = '#ff6b6b';
                } else {
                    lblHeroGeminiPlusUserWorkloadCost.textContent = "$0.00 (Included)";
                    lblHeroGeminiPlusUserWorkloadCost.style.color = '#0f9d58';
                }
            }

            if (lblHeroGeminiStdBadgeNote && lblHeroGeminiPlusBadgeNote) {
                if (state.geminiAgentPricingMode === 'flash') {
                    lblHeroGeminiStdBadgeNote.textContent = "Gemini 3.5 Flash PAYG";
                    lblHeroGeminiPlusBadgeNote.textContent = "Gemini 3.5 Flash PAYG";
                } else {
                    lblHeroGeminiStdBadgeNote.textContent = "Fully Bundled Rate";
                    lblHeroGeminiPlusBadgeNote.textContent = "Fully Bundled Rate";
                }
            }

            const lblGeminiStdLicPrice = document.getElementById('lbl-hero-gemini-std-lic-price');
            if (lblGeminiStdLicPrice) {
                lblGeminiStdLicPrice.textContent = "$" + formatNumber(state.geminiSeatPrice);
            }
            const lblGeminiPlusLicPrice = document.getElementById('lbl-hero-gemini-plus-lic-price');
            if (lblGeminiPlusLicPrice) {
                lblGeminiPlusLicPrice.textContent = "$" + formatNumber(state.geminiPlusSeatPrice);
            }

            // 3. CLAUDE ENTERPRISE COSTS (License Seats + API + Token Workloads)
            const claudeSeatTotal = state.seats * state.claudeSeatPrice;
            
            // Total monthly token consumption across 25 agents (for both Opus and Sonnet)
            const totalMonthlyTokens = (totalInputTokens + totalOutputTokens) * 30;
            const formattedTokensMonth = formatTokenMetric(totalMonthlyTokens);
            
            const lblOpusTokens = document.getElementById('lbl-hero-opus-tokens');
            if (lblOpusTokens) {
                lblOpusTokens.textContent = formattedTokensMonth;
            }
            const lblSonnetTokens = document.getElementById('lbl-hero-sonnet-tokens');
            if (lblSonnetTokens) {
                lblSonnetTokens.textContent = formattedTokensMonth;
            }
            if (lblHeroGeminiStdAgentTokens) {
                lblHeroGeminiStdAgentTokens.textContent = formattedTokensMonth;
            }
            if (lblHeroGeminiPlusAgentTokens) {
                lblHeroGeminiPlusAgentTokens.textContent = formattedTokensMonth;
            }

            // Claude Sonnet 4.6 Math
            const dailySonnetCost = (totalInputTokens / 1000000 * state.rates.sonnet46.in) + (totalOutputTokens / 1000000 * state.rates.sonnet46.out);
            const monthlySonnetCost = Math.round(dailySonnetCost * 30); // agent cost

            // Sonnet User Workloads (with Anthropic 90% caching read discount)
            const sonnetUncachedCost = (monthlyUncached / 1000000) * state.rates.sonnet46.in;
            const sonnetCachedCost = (monthlyCached / 1000000) * (state.rates.sonnet46.in * 0.1);
            const sonnetOutputCost = (monthlyOutput / 1000000) * state.rates.sonnet46.out;
            const sonnetUserWorkloadsCost = Math.round(sonnetUncachedCost + sonnetCachedCost + sonnetOutputCost);

            const totalSonnetClaudeCost = claudeSeatTotal + monthlySonnetCost + sonnetUserWorkloadsCost;
            if (lblHeroSonnetLicBreakdown) {
                lblHeroSonnetLicBreakdown.textContent = "$" + formatNumber(claudeSeatTotal);
            }
            if (lblHeroSonnetApiBreakdown) {
                lblHeroSonnetApiBreakdown.textContent = "$" + formatNumber(monthlySonnetCost);
            }
            const lblSonnetCodingTokens = document.getElementById('lbl-hero-sonnet-coding-tokens');
            if (lblSonnetCodingTokens) {
                lblSonnetCodingTokens.textContent = "$" + formatNumber(sonnetUserWorkloadsCost);
            }
            if (lblHeroSonnetUserTokensVol) {
                lblHeroSonnetUserTokensVol.textContent = formatTokenMetric(totalUserWorkloadsTokens);
            }
            const lblClaudeLicPriceSonnet = document.getElementById('lbl-hero-claude-lic-price-sonnet');
            if (lblClaudeLicPriceSonnet) {
                lblClaudeLicPriceSonnet.textContent = "$" + formatNumber(state.claudeSeatPrice);
            }

            // Opus 4.8 Math
            const dailyClaude48Cost = (totalInputTokens / 1000000 * state.rates.claude48.in) + (totalOutputTokens / 1000000 * state.rates.claude48.out);
            const monthlyClaude48Cost = Math.round(dailyClaude48Cost * 30); // agent cost

            // Opus User Workloads (with Anthropic 90% caching read discount)
            const opusUncachedCost = (monthlyUncached / 1000000) * state.rates.claude48.in;
            const opusCachedCost = (monthlyCached / 1000000) * (state.rates.claude48.in * 0.1);
            const opusOutputCost = (monthlyOutput / 1000000) * state.rates.claude48.out;
            const opusUserWorkloadsCost = Math.round(opusUncachedCost + opusCachedCost + opusOutputCost);

            const totalClaude48Cost = claudeSeatTotal + monthlyClaude48Cost + opusUserWorkloadsCost;

            // Render dynamic Claude cost and toggle breakdown groups based on active model selector
            if (lblHeroClaudeCost) {
                if (state.claudeModel === 'sonnet') {
                    lblHeroClaudeCost.textContent = "$" + formatNumber(totalSonnetClaudeCost);
                } else {
                    lblHeroClaudeCost.textContent = "$" + formatNumber(totalClaude48Cost);
                }
            }

            if (lblHeroClaudeSubCost) {
                if (state.claudeModel === 'sonnet') {
                    lblHeroClaudeSubCost.textContent = "With Sonnet 4.6";
                } else {
                    lblHeroClaudeSubCost.textContent = "With Opus 4.8";
                }
            }

            if (claudeOpusBreakdownGroup && claudeSonnetBreakdownGroup) {
                if (state.claudeModel === 'sonnet') {
                    claudeOpusBreakdownGroup.style.display = 'none';
                    claudeSonnetBreakdownGroup.style.display = 'block';
                } else {
                    claudeOpusBreakdownGroup.style.display = 'block';
                    claudeSonnetBreakdownGroup.style.display = 'none';
                }
            }

            if (lblHeroClaudeLicBreakdown) {
                lblHeroClaudeLicBreakdown.textContent = "$" + formatNumber(claudeSeatTotal);
            }
            if (lblHeroClaudeApiBreakdown) {
                lblHeroClaudeApiBreakdown.textContent = "$" + formatNumber(monthlyClaude48Cost);
            }
            const lblOpusCodingTokens = document.getElementById('lbl-hero-opus-coding-tokens');
            if (lblOpusCodingTokens) {
                lblOpusCodingTokens.textContent = "$" + formatNumber(opusUserWorkloadsCost);
            }
            if (lblHeroOpusUserTokensVol) {
                lblHeroOpusUserTokensVol.textContent = formatTokenMetric(totalUserWorkloadsTokens);
            }
            const lblClaudeLicPrice = document.getElementById('lbl-hero-claude-lic-price');
            if (lblClaudeLicPrice) {
                lblClaudeLicPrice.textContent = "$" + formatNumber(state.claudeSeatPrice);
            }

            // 3. CHATGPT ENTERPRISE COSTS (Flexible Credit Consumption)
            const chatgptMinCreditsTotal = state.seats * state.chatgptMinCredits;
            const chatgptMinCost = chatgptMinCreditsTotal * state.chatgptCreditPrice;

            // Determine credit rates based on selected ChatGPT model (GPT-5.4 or GPT-5.5)
            const chatgptRates = state.chatgptModel === 'gpt55' 
                ? { name: 'GPT-5.5', in: state.chatgptRates.gpt55.in, out: state.chatgptRates.gpt55.out }
                : { name: 'GPT-5.4', in: state.chatgptRates.gpt54.in, out: state.chatgptRates.gpt54.out };

            // Agent credits: burn rates determined by selected model
            const chatgptAgentInputCredits = (totalInputTokens * 30 / 1000000) * chatgptRates.in;
            const chatgptAgentOutputCredits = (totalOutputTokens * 30 / 1000000) * chatgptRates.out;
            const chatgptAgentCredits = chatgptAgentInputCredits + chatgptAgentOutputCredits;
            const chatgptAgentCost = chatgptAgentCredits * state.chatgptCreditPrice;

            // ChatGPT user token workloads credits: using same token workloads, with OpenAI 90% cached input credit discount (cached is 10% of standard input)
            const chatgptUncachedCredits = (monthlyUncached / 1000000) * chatgptRates.in;
            const chatgptCachedCredits = (monthlyCached / 1000000) * (chatgptRates.in * 0.1);
            const chatgptOutputCredits = (monthlyOutput / 1000000) * chatgptRates.out;
            const chatgptCodingCredits = chatgptUncachedCredits + chatgptCachedCredits + chatgptOutputCredits;
            const chatgptCodingCost = chatgptCodingCredits * state.chatgptCreditPrice;

            // Total credits needed (Sum of agents and developer coding, ensuring each user seat has min 200 credits)
            const totalActualCredits = chatgptAgentCredits + chatgptCodingCredits;
            const chatgptTotalCredits = Math.max(chatgptMinCreditsTotal, totalActualCredits);
            const chatgptTotalCost = Math.round(chatgptTotalCredits * state.chatgptCreditPrice);

            // Update ChatGPT DOM Elements
            if (lblHeroChatgptCost) {
                lblHeroChatgptCost.textContent = "$" + formatNumber(chatgptTotalCost);
            }
            if (lblHeroChatgptMinBreakdown) {
                if (totalActualCredits >= chatgptMinCreditsTotal) {
                    lblHeroChatgptMinBreakdown.textContent = "$" + formatNumber(Math.round(chatgptMinCost)) + " (Included)";
                } else {
                    lblHeroChatgptMinBreakdown.textContent = "$" + formatNumber(Math.round(chatgptMinCost));
                }
            }
            if (lblHeroChatgptAgentCredits) {
                lblHeroChatgptAgentCredits.textContent = formatTokenMetric(Math.round(chatgptAgentCredits));
            }
            if (lblHeroChatgptAgentBreakdown) {
                if (totalActualCredits >= chatgptMinCreditsTotal) {
                    lblHeroChatgptAgentBreakdown.textContent = "$" + formatNumber(Math.round(chatgptAgentCost));
                } else {
                    lblHeroChatgptAgentBreakdown.textContent = "$0 (Included in min)";
                }
            }
            if (lblHeroChatgptCodingCredits) {
                lblHeroChatgptCodingCredits.textContent = formatTokenMetric(Math.round(chatgptCodingCredits));
            }
            if (lblHeroChatgptCodingBreakdown) {
                if (totalActualCredits >= chatgptMinCreditsTotal) {
                    lblHeroChatgptCodingBreakdown.textContent = "$" + formatNumber(Math.round(chatgptCodingCost));
                } else {
                    lblHeroChatgptCodingBreakdown.textContent = "$0 (Included in min)";
                }
            }
            if (lblHeroChatgptTotalCredits) {
                lblHeroChatgptTotalCredits.textContent = formatTokenMetric(Math.round(chatgptTotalCredits));
            }

            const lblChatgptCreditsModelTitle = document.getElementById('lbl-hero-chatgpt-credits-model-title');
            if (lblChatgptCreditsModelTitle) {
                lblChatgptCreditsModelTitle.textContent = chatgptRates.name + " Credits/mo";
            }

            const lblChatgptFootnoteBurnRates = document.getElementById('lbl-hero-chatgpt-footnote-burn-rates');
            if (lblChatgptFootnoteBurnRates) {
                lblChatgptFootnoteBurnRates.textContent = "Credits calculated based on " + chatgptRates.name + " burn rates (" + chatgptRates.in + " input / " + chatgptRates.out + " output credits per 1M tokens).";
            }

            // Update ChatGPT Footnote parameters dynamically
            const lblFootnotePrice = document.getElementById('lbl-hero-chatgpt-footnote-price');
            if (lblFootnotePrice) {
                lblFootnotePrice.textContent = state.chatgptCreditPrice.toFixed(3);
            }
            const lblFootnoteMin = document.getElementById('lbl-hero-chatgpt-footnote-min');
            if (lblFootnoteMin) {
                lblFootnoteMin.textContent = formatNumber(state.chatgptMinCredits);
            }
            const lblFootnoteMinCost = document.getElementById('lbl-hero-chatgpt-footnote-min-cost');
            if (lblFootnoteMinCost) {
                lblFootnoteMinCost.textContent = (state.chatgptMinCredits * state.chatgptCreditPrice).toFixed(2);
            }

            // Quotas capacity calculation (Standard limits vs. Plus limits)
            const queriesPerUserPerDay = state.edition === 'plus' ? 200 : 160;
            const pooledLimit = state.seats * queriesPerUserPerDay;
            const quotaPct = Math.min((totalRequests / pooledLimit) * 100, 100).toFixed(1);

            if (lblQuotaProgressPct) lblQuotaProgressPct.textContent = quotaPct + "% Utilized";
            if (lblQuotaNumbers) lblQuotaNumbers.textContent = formatNumber(totalRequests) + " / " + formatNumber(pooledLimit) + " queries";
            if (quotaBar) {
                quotaBar.style.width = quotaPct + "%";
                quotaBar.className = 'quota-progress-bar';
                if (totalRequests > pooledLimit) {
                    quotaBar.className = 'quota-progress-bar danger';
                } else if (quotaPct > 80) {
                    quotaBar.className = 'quota-progress-bar warning';
                }
            }

            if (quotaWarningBanner) {
                quotaWarningBanner.style.display = totalRequests > pooledLimit ? 'flex' : 'none';
            }

            if (lblQuotaLimitNote) {
                lblQuotaLimitNote.textContent = "Combined pool across " + formatNumber(state.seats) + " users. Daily requests capped at " + formatNumber(pooledLimit) + " queries.";
            }

            // ROI Card calculations (Toggles based on standard vs. plus edition)
            // Assistant Quota Valuation: $0.10/query (removed from total pooled calculation)
            const monthlyAssistantVal = pooledLimit * 30 * 0.10;
            if (lblRoiAssistant) {
                lblRoiAssistant.textContent = "$" + formatNumber(Math.round(monthlyAssistantVal)) + " / mo";
            }

            // Workspace Storage: Standard 30 GB/seat, Plus 75 GB/seat. Valued @ $5.00/GB
            const storagePerSeat = state.edition === 'plus' ? 75 : 30;
            const monthlyStorageVal = state.seats * storagePerSeat * 5.00;
            lblRoiStorage.textContent = "$" + formatNumber(Math.round(monthlyStorageVal)) + " / mo";
            lblRoiStorageLabel.textContent = "Storage (" + storagePerSeat + " GB/seat)";

            // Deep Research: Standard 3, Plus 10 queries/user/day. Valued @ $4.00/query
            const deepResearchPerUser = state.edition === 'plus' ? 10 : 3;
            const monthlyDeepVal = state.seats * deepResearchPerUser * 30 * 4.00;
            lblRoiDeepResearch.textContent = "$" + formatNumber(Math.round(monthlyDeepVal)) + " / mo";
            lblRoiDeepResearchLabel.textContent = "Deep Research (" + deepResearchPerUser + "/user/day)";

            // Video Generation: Standard 2, Plus 3 requests/day. 5s average @ $0.40/s overage
            const videoPerUser = state.edition === 'plus' ? 3 : 2;
            const monthlyVideoVal = state.seats * videoPerUser * 30 * 5 * 0.40;
            lblRoiVideo.textContent = "$" + formatNumber(Math.round(monthlyVideoVal)) + " / mo";
            lblRoiVideoLabel.textContent = "Video Generation (" + videoPerUser + "/user/day)";

            // Image Generation: Standard 5, Plus 10 images/day @ $0.02
            const imagePerUser = state.edition === 'plus' ? 10 : 5;
            const monthlyImageVal = state.seats * imagePerUser * 30 * 0.02;
            lblRoiImage.textContent = "$" + formatNumber(Math.round(monthlyImageVal)) + " / mo";
            lblRoiImageLabel.textContent = "Image Generation (" + imagePerUser + "/user/day)";

            // Total Realized Pooled Value (excluding Assistant Queries)
            const totalPooledRealizedVal = monthlyStorageVal + monthlyDeepVal + monthlyVideoVal + monthlyImageVal;
            lblRoiTotalValue.textContent = "$" + formatNumber(Math.round(totalPooledRealizedVal));

            // Calculate widths for the stacked bar with a minimum width for legibility
            if (totalPooledRealizedVal > 0) {
                const searchPct = 15; // fixed size for Search
                const availablePct = 100 - searchPct;
                
                // Raw percentages
                let storagePct = (monthlyStorageVal / totalPooledRealizedVal) * availablePct;
                let deepPct = (monthlyDeepVal / totalPooledRealizedVal) * availablePct;
                let videoPct = (monthlyVideoVal / totalPooledRealizedVal) * availablePct;
                let imagePct = (monthlyImageVal / totalPooledRealizedVal) * availablePct;

                // Ensure a minimum width (e.g., 10%) for any non-zero segment so labels fit
                const minPct = 10;
                let activeSegments = 0;
                if (monthlyStorageVal > 0) activeSegments++;
                if (monthlyDeepVal > 0) activeSegments++;
                if (monthlyVideoVal > 0) activeSegments++;
                if (monthlyImageVal > 0) activeSegments++;

                // Only apply min-width if we have multiple segments
                if (activeSegments > 1) {
                    const segments = [
                        { id: 'storage', val: monthlyStorageVal, pct: storagePct },
                        { id: 'deep', val: monthlyDeepVal, pct: deepPct },
                        { id: 'video', val: monthlyVideoVal, pct: videoPct },
                        { id: 'image', val: monthlyImageVal, pct: imagePct }
                    ];

                    // First pass: give min width to small segments
                    let forcedPct = 0;
                    let remainingPct = availablePct;
                    let flexibleSegments = [];

                    segments.forEach(s => {
                        if (s.val > 0) {
                            if (s.pct < minPct) {
                                s.pct = minPct;
                                forcedPct += minPct;
                            } else {
                                flexibleSegments.push(s);
                            }
                        }
                    });

                    // Second pass: distribute remaining space among flexible segments
                    const remainingSpace = availablePct - forcedPct;
                    const flexibleTotalVal = flexibleSegments.reduce((sum, s) => sum + s.val, 0);
                    
                    if (flexibleTotalVal > 0) {
                        flexibleSegments.forEach(s => {
                            s.pct = (s.val / flexibleTotalVal) * remainingSpace;
                        });
                    }

                    // Update local variables
                    storagePct = segments.find(s => s.id === 'storage').pct;
                    deepPct = segments.find(s => s.id === 'deep').pct;
                    videoPct = segments.find(s => s.id === 'video').pct;
                    imagePct = segments.find(s => s.id === 'image').pct;
                }

                const barStorage = document.getElementById('bar-roi-storage');
                const barDeep = document.getElementById('bar-roi-deep');
                const barVideo = document.getElementById('bar-roi-video');
                const barImage = document.getElementById('bar-roi-image');
                const barSearch = document.getElementById('bar-roi-search');

                if (barStorage) barStorage.style.width = storagePct + "%";
                if (barDeep) barDeep.style.width = deepPct + "%";
                if (barVideo) barVideo.style.width = videoPct + "%";
                if (barImage) barImage.style.width = imagePct + "%";
                if (barSearch) barSearch.style.width = searchPct + "%";

                // Update segment titles/tooltips
                if (barStorage) barStorage.setAttribute('title', 'Storage: $' + formatNumber(Math.round(monthlyStorageVal)) + '/mo');
                if (barDeep) barDeep.setAttribute('title', 'Deep Research: $' + formatNumber(Math.round(monthlyDeepVal)) + '/mo');
                if (barVideo) barVideo.setAttribute('title', 'Video Gen: $' + formatNumber(Math.round(monthlyVideoVal)) + '/mo');
                if (barImage) barImage.setAttribute('title', 'Image Gen: $' + formatNumber(Math.round(monthlyImageVal)) + '/mo');
                if (barSearch) barSearch.setAttribute('title', 'Enterprise Search: Unlimited ($0 Overage Cost)');
            }

            // ROI Ratio Factor based on selected details subscription price
            const activeGeminiSub = state.edition === 'plus' ? geminiPlusTotal : geminiStdTotal;
            if (activeGeminiSub > 0) {
                const roiFactor = (totalPooledRealizedVal / activeGeminiSub).toFixed(1);
                lblRoiRatio.textContent = roiFactor + "x ROI";
            } else {
                lblRoiRatio.textContent = "N/A";
            }

            lblRoiCardTitle.textContent = state.edition === 'plus' 
                ? "Gemini Enterprise Subscription Additional Value (Plus)" 
                : "Gemini Enterprise Subscription Additional Value";

            renderAgentTable();
        }

        // Helper to update the Delete Selected button's disabled state, label, and master checkbox
        function updateDeleteButtonState() {
            if (!deleteSelectedCount || !btnDeleteSelected || !chkSelectAll) return;
            
            const count = state.selectedAgentIds.size;
            deleteSelectedCount.textContent = count;
            
            if (count > 0) {
                btnDeleteSelected.removeAttribute('disabled');
                btnDeleteSelected.classList.add('active');
            } else {
                btnDeleteSelected.setAttribute('disabled', 'true');
                btnDeleteSelected.classList.remove('active');
            }
            
            // Sync the select-all checkbox
            const filteredVisibleAgents = state.agents.filter(agent => {
                const matchesVertical = state.activeFilter === 'All' || agent.vertical === state.activeFilter;
                const matchesSearch = agent.name.toLowerCase().includes(state.searchQuery.toLowerCase());
                return matchesVertical && matchesSearch;
            });
            
            if (filteredVisibleAgents.length > 0) {
                const allSelected = filteredVisibleAgents.every(agent => state.selectedAgentIds.has(agent.id));
                chkSelectAll.checked = allSelected;
            } else {
                chkSelectAll.checked = false;
            }
        }
        window.updateDeleteButtonState = updateDeleteButtonState;

        // Build & Render table rows SAFELY using Vanilla DOM APIs (Preventing XSS completely)
        function renderAgentTable() {
            agentTableBody.replaceChildren(); // Safe DOM clear API

            const filteredAgents = state.agents.filter(agent => {
                const matchesVertical = state.activeFilter === 'All' || agent.vertical === state.activeFilter;
                const matchesSearch = agent.name.toLowerCase().includes(state.searchQuery.toLowerCase());
                return matchesVertical && matchesSearch;
            });

            if (filteredAgents.length === 0) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.setAttribute('colspan', '6');
                td.style.textAlign = 'center';
                td.style.padding = '2rem';
                td.style.color = 'var(--text-muted)';
                td.textContent = 'No agents found matching search or vertical filter.';
                tr.appendChild(td);
                agentTableBody.appendChild(tr);
                updateDeleteButtonState();
                return;
            }

            filteredAgents.forEach(agent => {
                const tr = document.createElement('tr');

                // Checkbox selection cell (far left)
                const tdSelect = document.createElement('td');
                tdSelect.style.textAlign = 'center';
                const checkboxSelect = document.createElement('input');
                checkboxSelect.type = 'checkbox';
                checkboxSelect.className = 'agent-row-select';
                checkboxSelect.style.cursor = 'pointer';
                checkboxSelect.style.accentColor = 'var(--gemini-primary)';
                checkboxSelect.dataset.id = agent.id;
                checkboxSelect.checked = state.selectedAgentIds.has(agent.id);
                checkboxSelect.addEventListener('change', () => {
                    if (checkboxSelect.checked) {
                        state.selectedAgentIds.add(agent.id);
                    } else {
                        state.selectedAgentIds.delete(agent.id);
                    }
                    updateDeleteButtonState();
                });
                tdSelect.appendChild(checkboxSelect);
                tr.appendChild(tdSelect);

                // Vertical
                const tdVertical = document.createElement('td');
                tdVertical.className = 'vertical-cell';
                tdVertical.textContent = agent.vertical;
                tr.appendChild(tdVertical);

                // Name
                const tdName = document.createElement('td');
                tdName.className = 'name-cell';
                tdName.textContent = agent.name;
                tr.appendChild(tdName);

                // Daily Requests
                const tdRequests = document.createElement('td');
                tdRequests.style.textAlign = 'right';
                const inputRequests = document.createElement('input');
                inputRequests.className = 'table-input';
                inputRequests.type = 'number';
                inputRequests.value = agent.dailyRequests;
                inputRequests.addEventListener('change', (e) => {
                    const val = parseInt(e.target.value) || 0;
                    agent.dailyRequests = Math.max(0, val);
                    clearPresetActiveStates();
                    calculateAll();
                });
                tdRequests.appendChild(inputRequests);
                tr.appendChild(tdRequests);

                // Input Tokens
                const tdInputTokens = document.createElement('td');
                tdInputTokens.style.textAlign = 'right';
                const inputIn = document.createElement('input');
                inputIn.className = 'table-input';
                inputIn.type = 'number';
                inputIn.value = agent.inputTokens;
                inputIn.addEventListener('change', (e) => {
                    const val = parseInt(e.target.value) || 0;
                    agent.inputTokens = Math.max(0, val);
                    clearPresetActiveStates();
                    calculateAll();
                });
                tdInputTokens.appendChild(inputIn);
                tr.appendChild(tdInputTokens);

                // Output Tokens
                const tdOutputTokens = document.createElement('td');
                tdOutputTokens.style.textAlign = 'right';
                const inputOut = document.createElement('input');
                inputOut.className = 'table-input';
                inputOut.type = 'number';
                inputOut.value = agent.outputTokens;
                inputOut.addEventListener('change', (e) => {
                    const val = parseInt(e.target.value) || 0;
                    agent.outputTokens = Math.max(0, val);
                    clearPresetActiveStates();
                    calculateAll();
                });
                tdOutputTokens.appendChild(inputOut);
                tr.appendChild(tdOutputTokens);

                agentTableBody.appendChild(tr);
            });

            // Update master and button state
            updateDeleteButtonState();
        }

        // Event hooks
        function attachEventListeners() {
            // Master Select-All Checkbox change handler
            if (chkSelectAll) {
                chkSelectAll.addEventListener('change', (e) => {
                    const checked = e.target.checked;
                    const filteredVisibleAgents = state.agents.filter(agent => {
                        const matchesVertical = state.activeFilter === 'All' || agent.vertical === state.activeFilter;
                        const matchesSearch = agent.name.toLowerCase().includes(state.searchQuery.toLowerCase());
                        return matchesVertical && matchesSearch;
                    });
                    
                    filteredVisibleAgents.forEach(agent => {
                        if (checked) {
                            state.selectedAgentIds.add(agent.id);
                        } else {
                            state.selectedAgentIds.delete(agent.id);
                        }
                    });
                    
                    renderAgentTable();
                });
            }

            // Delete Selected button click handler
            if (btnDeleteSelected) {
                btnDeleteSelected.addEventListener('click', () => {
                    if (state.selectedAgentIds.size === 0) return;
                    
                    // Filter out selected agent IDs from state.agents
                    state.agents = state.agents.filter(agent => !state.selectedAgentIds.has(agent.id));
                    
                    // Clear the selected agents set
                    state.selectedAgentIds.clear();
                    
                    // Clear active preset state & recalculate
                    clearPresetActiveStates();
                    calculateAll();
                });
            }
            // Slider Seats
            sliderSeats.addEventListener('input', () => {
                if (!state.isApplyingPreset) clearPresetActiveStates();
                clampWorkloads('seats');
                calculateAll();
            });
            sliderSeats.addEventListener('change', () => {
                if (!state.isApplyingPreset) clearPresetActiveStates();
                clampWorkloads('seats');
                calculateAll();
            });

            // Workload Sliders
            sliderWorkloadPower.addEventListener('input', () => {
                if (!state.isApplyingPreset) clearPresetActiveStates();
                clampWorkloads('power');
                calculateAll();
            });
            sliderWorkloadPower.addEventListener('change', () => {
                if (!state.isApplyingPreset) clearPresetActiveStates();
                clampWorkloads('power');
                calculateAll();
            });
            sliderWorkloadPro.addEventListener('input', () => {
                if (!state.isApplyingPreset) clearPresetActiveStates();
                clampWorkloads('pro');
                calculateAll();
            });
            sliderWorkloadPro.addEventListener('change', () => {
                if (!state.isApplyingPreset) clearPresetActiveStates();
                clampWorkloads('pro');
                calculateAll();
            });
            sliderWorkloadBusiness.addEventListener('input', () => {
                if (!state.isApplyingPreset) clearPresetActiveStates();
                clampWorkloads('business');
                calculateAll();
            });
            sliderWorkloadBusiness.addEventListener('change', () => {
                if (!state.isApplyingPreset) clearPresetActiveStates();
                clampWorkloads('business');
                calculateAll();
            });

            // Seat prices for Gemini and Claude
            inputGeminiPrice.addEventListener('input', () => {
                clearPresetActiveStates();
                calculateAll();
            });
            inputGeminiPlusPrice.addEventListener('input', () => {
                clearPresetActiveStates();
                calculateAll();
            });
            inputClaudeSeatPrice.addEventListener('input', () => {
                clearPresetActiveStates();
                calculateAll();
            });

            // Config rates inputs
            inputRateClaudeIn.addEventListener('input', () => {
                clearPresetActiveStates();
                calculateAll();
            });
            inputRateClaudeOut.addEventListener('input', () => {
                clearPresetActiveStates();
                calculateAll();
            });
            inputRateSonnetIn.addEventListener('input', () => {
                clearPresetActiveStates();
                calculateAll();
            });
            inputRateSonnetOut.addEventListener('input', () => {
                clearPresetActiveStates();
                calculateAll();
            });

            // ChatGPT inputs
            inputChatgptCreditPrice.addEventListener('input', () => {
                clearPresetActiveStates();
                calculateAll();
            });
            inputChatgptMinCredits.addEventListener('input', () => {
                clearPresetActiveStates();
                calculateAll();
            });
            inputRateGpt55In.addEventListener('input', () => {
                clearPresetActiveStates();
                calculateAll();
            });
            inputRateGpt55Out.addEventListener('input', () => {
                clearPresetActiveStates();
                calculateAll();
            });
            inputRateGpt54In.addEventListener('input', () => {
                clearPresetActiveStates();
                calculateAll();
            });
            inputRateGpt54Out.addEventListener('input', () => {
                clearPresetActiveStates();
                calculateAll();
            });

            // Searching input
            inputSearch.addEventListener('input', (e) => {
                state.searchQuery = e.target.value;
                renderAgentTable();
            });

            // Vertical filter buttons (pills)
            filterTabs.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-pill')) {
                    const pills = filterTabs.querySelectorAll('.filter-pill');
                    pills.forEach(p => p.classList.remove('active'));
                    e.target.classList.add('active');
                    state.activeFilter = e.target.getAttribute('data-vertical');
                    renderAgentTable();
                }
            });

            // Add Custom Agent Form Trigger
            btnAddAgent.addEventListener('click', () => {
                const nameVal = addName.value.trim();
                const vertVal = addVertical.value;
                const reqsVal = parseInt(addRequests.value) || 0;
                const inVal = parseInt(addInput.value) || 0;
                const outVal = parseInt(addOutput.value) || 0;

                if (!nameVal) {
                    alert('Please specify a unique name for the custom agent.');
                    return;
                }

                const newId = state.agents.length > 0 ? Math.max(...state.agents.map(a => a.id)) + 1 : 1;
                const newAgent = {
                    id: newId,
                    vertical: vertVal,
                    name: nameVal,
                    dailyRequests: Math.max(0, reqsVal),
                    inputTokens: Math.max(0, inVal),
                    outputTokens: Math.max(0, outVal)
                };

                state.agents.push(newAgent);
                
                // Clear preset state & recalculate
                clearPresetActiveStates();
                
                // Clear fields
                addName.value = '';
                addRequests.value = '1000';
                addInput.value = '1500';
                addOutput.value = '500';

                calculateAll();
            });

            // Reset Workspace handler
            btnReset.addEventListener('click', () => {
                clearPresetActiveStates();
                state.selectedAgentIds.clear();
                state.agents = JSON.parse(JSON.stringify(defaultAgents));
                state.seats = 1000;
                sliderSeats.value = 1000;
                inputGeminiPrice.value = 30;
                state.geminiSeatPrice = 30;
                inputGeminiPlusPrice.value = 50;
                state.geminiPlusSeatPrice = 50;
                inputClaudeSeatPrice.value = 20;
                state.claudeSeatPrice = 20;
                state.codeAssistValue = 3762;

                lblHeroGeminiTitle.textContent = "Gemini Enterprise";
                document.getElementById('lbl-gemini-edition-badge').textContent = "FLAT SUBSCRIPTIONS";

                inputSearch.value = '';
                state.searchQuery = '';
                state.activeFilter = 'All';

                inputRateClaudeIn.value = 5.0;
                inputRateClaudeOut.value = 25.0;
                inputRateSonnetIn.value = 3.0;
                inputRateSonnetOut.value = 15.0;

                // Reset ChatGPT parameters
                state.chatgptCreditPrice = 0.035;
                state.chatgptMinCredits = 200;
                state.chatgptRates.gpt55.in = 125.00;
                state.chatgptRates.gpt55.out = 750.00;
                state.chatgptRates.gpt54.in = 62.50;
                state.chatgptRates.gpt54.out = 375.00;

                inputChatgptCreditPrice.value = 0.035;
                inputChatgptMinCredits.value = 200;
                inputRateGpt55In.value = 125;
                inputRateGpt55Out.value = 750;
                inputRateGpt54In.value = 62.50;
                inputRateGpt54Out.value = 375;

                const pills = filterTabs.querySelectorAll('.filter-pill');
                pills.forEach(p => p.classList.remove('active'));
                pills[0].classList.add('active');

                // Collapse modeler and pricing matrices
                document.getElementById('modeler-accordion').open = false;
                document.getElementById('claude-matrix-accordion').open = false;
                document.getElementById('chatgpt-matrix-accordion').open = false;
                document.getElementById('roi-accordion').open = true;

                // Reset workload parameters
                state.workloadMode = 'agentic';
                state.usersPower = 100;
                state.usersPro = 250;
                state.usersBusiness = 500;

                sliderWorkloadPower.max = 1000;
                sliderWorkloadPro.max = 1000;
                sliderWorkloadBusiness.max = 1000;

                sliderWorkloadPower.value = 100;
                sliderWorkloadPro.value = 250;
                sliderWorkloadBusiness.value = 500;

                setWorkloadMode('agentic');
                setChatgptModel('gpt54');
                setDetailsEdition('std');
                setGeminiAgentPricing('as-is');
                setClaudeModel('opus');
            });

            // Stacked bar segment click listener to highlight cards
            const barStorage = document.getElementById('bar-roi-storage');
            const barDeep = document.getElementById('bar-roi-deep');
            const barVideo = document.getElementById('bar-roi-video');
            const barImage = document.getElementById('bar-roi-image');
            const barSearch = document.getElementById('bar-roi-search');

            function toggleHighlight(cardId) {
                const card = document.getElementById(cardId);
                if (!card) return;
                
                const wasHighlighted = card.classList.contains('highlighted');
                
                // Clear all highlights
                document.querySelectorAll('.roi-legend-item').forEach(item => {
                    item.classList.remove('highlighted');
                });
                
                // Toggle current highlight
                if (!wasHighlighted) {
                    card.classList.add('highlighted');
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }

            if (barStorage) {
                barStorage.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleHighlight('card-roi-storage');
                });
            }
            if (barDeep) {
                barDeep.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleHighlight('card-roi-deep');
                });
            }
            if (barVideo) {
                barVideo.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleHighlight('card-roi-video');
                });
            }
            if (barImage) {
                barImage.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleHighlight('card-roi-image');
                });
            }
            if (barSearch) {
                barSearch.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleHighlight('card-roi-search');
                });
            }

            // Clear highlights when clicking anywhere else on document
            document.addEventListener('click', () => {
                document.querySelectorAll('.roi-legend-item').forEach(item => {
                    item.classList.remove('highlighted');
                });
            });
        }

        // Start App
        init();
    