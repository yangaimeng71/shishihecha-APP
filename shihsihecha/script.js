// 应用主类
class FactCheckApp {
    constructor() {
        this.currentPage = 'archive-page';
        this.selectedCategory = 'all';
        this.selectedVerifyCategory = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupSearch();
        this.setupCategoryFilter();
        this.setupVerificationForm();
        this.setupSubscriptionActions();
    }

    // 绑定事件
    bindEvents() {
        // 底部导航切换
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const targetPage = e.currentTarget.dataset.page;
                this.switchPage(targetPage);
            });
        });

        // 分类导航点击
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterByCategory(category);
            });
        });

        // 搜索功能
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // 麦克风图标点击
        const micIcon = document.querySelector('.mic-icon');
        if (micIcon) {
            micIcon.addEventListener('click', () => {
                this.handleVoiceInput();
            });
        }
    }

    // 页面切换
    switchPage(pageId) {
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // 显示目标页面
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeNavItem = document.querySelector(`[data-page="${pageId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        this.currentPage = pageId;

        // 页面特定初始化
        if (pageId === 'archive-page') {
            this.initArchivePage();
        } else if (pageId === 'verify-page') {
            this.initVerifyPage();
        } else if (pageId === 'subscription-page') {
            this.initSubscriptionPage();
        }
    }

    // 初始化观点档案馆页面
    initArchivePage() {
        // 重置分类筛选
        this.selectedCategory = 'all';
        this.updateCategoryNav();
        this.showAllOpinions();
    }

    // 初始化查个究竟页面
    initVerifyPage() {
        // 重置表单
        this.resetVerificationForm();
    }

    // 初始化订阅页面
    initSubscriptionPage() {
        // 可以在这里添加订阅相关的初始化逻辑
    }

    // 设置搜索功能
    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            // 防抖搜索
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }
    }

    // 处理搜索
    handleSearch(query) {
        if (!query.trim()) {
            this.showAllOpinions();
            return;
        }

        const opinions = document.querySelectorAll('.opinion-card');
        const topics = document.querySelectorAll('.topic-card');

        // 搜索观点卡片
        opinions.forEach(opinion => {
            const title = opinion.querySelector('h4').textContent.toLowerCase();
            const content = opinion.querySelector('p').textContent.toLowerCase();
            const searchQuery = query.toLowerCase();

            if (title.includes(searchQuery) || content.includes(searchQuery)) {
                opinion.style.display = 'flex';
            } else {
                opinion.style.display = 'none';
            }
        });

        // 搜索热门话题
        topics.forEach(topic => {
            const title = topic.querySelector('h3').textContent.toLowerCase();
            const content = topic.querySelector('p').textContent.toLowerCase();
            const searchQuery = query.toLowerCase();

            if (title.includes(searchQuery) || content.includes(searchQuery)) {
                topic.style.display = 'block';
            } else {
                topic.style.display = 'none';
            }
        });
    }

    // 设置分类筛选
    setupCategoryFilter() {
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterByCategory(category);
            });
        });
    }

    // 按分类筛选
    filterByCategory(category) {
        this.selectedCategory = category;
        this.updateCategoryNav();

        const opinions = document.querySelectorAll('.opinion-card');
        const topics = document.querySelectorAll('.topic-card');

        if (category === 'all') {
            // 显示所有内容
            opinions.forEach(opinion => {
                opinion.style.display = 'flex';
            });
            topics.forEach(topic => {
                topic.style.display = 'block';
            });
        } else {
            // 按分类筛选
            opinions.forEach(opinion => {
                const opinionCategory = opinion.dataset.category;
                if (opinionCategory === category) {
                    opinion.style.display = 'flex';
                } else {
                    opinion.style.display = 'none';
                }
            });

            // 热门话题也按分类筛选
            topics.forEach(topic => {
                const topicCategory = topic.querySelector('.category').textContent;
                if (this.getCategoryKey(topicCategory) === category) {
                    topic.style.display = 'block';
                } else {
                    topic.style.display = 'none';
                }
            });
        }
    }

    // 获取分类键值
    getCategoryKey(categoryName) {
        const categoryMap = {
            '健康': 'health',
            '科技': 'tech',
            '社会': 'society',
            '娱乐': 'entertainment'
        };
        return categoryMap[categoryName] || 'other';
    }

    // 更新分类导航状态
    updateCategoryNav() {
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.category === this.selectedCategory) {
                item.classList.add('active');
            }
        });
    }

    // 显示所有观点
    showAllOpinions() {
        document.querySelectorAll('.opinion-card').forEach(opinion => {
            opinion.style.display = 'flex';
        });
        document.querySelectorAll('.topic-card').forEach(topic => {
            topic.style.display = 'block';
        });
    }

    // 设置核查表单
    setupVerificationForm() {
        // 分类选择
        document.querySelectorAll('.category-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectVerifyCategory(e.currentTarget);
            });
        });

        // 提交按钮
        const submitBtn = document.getElementById('submit-verify');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitVerification();
            });
        }

        // 重新核查按钮
        const retryBtn = document.getElementById('retry-verification');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.retryVerification();
            });
        }

        // 上传区域点击
        document.querySelectorAll('.upload-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleUpload(e.currentTarget);
            });
        });
    }

    // 选择核查分类
    selectVerifyCategory(optionElement) {
        // 移除之前的选中状态
        document.querySelectorAll('.category-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // 添加选中状态
        optionElement.classList.add('selected');
        this.selectedVerifyCategory = optionElement.dataset.category;
    }

    // 处理上传
    handleUpload(uploadElement) {
        const uploadType = uploadElement.querySelector('span').textContent;
        
        if (uploadType === '截图') {
            this.handleImageUpload();
        } else if (uploadType === '链接') {
            this.handleLinkUpload();
        } else if (uploadType === '视频') {
            this.handleVideoUpload();
        }
    }

    // 处理图片上传
    handleImageUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.showUploadSuccess('截图上传成功');
            }
        };
        input.click();
    }

    // 处理链接上传
    handleLinkUpload() {
        const link = prompt('请输入要核查的链接：');
        if (link) {
            this.showUploadSuccess('链接添加成功');
        }
    }

    // 处理视频上传
    handleVideoUpload() {
        const videoTitle = prompt('请输入视频标题：');
        if (videoTitle) {
            this.showUploadSuccess('视频信息添加成功');
        }
    }

    // 显示上传成功提示
    showUploadSuccess(message) {
        // 创建临时提示
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            z-index: 3000;
            font-size: 14px;
            font-weight: 500;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }

    // 提交核查
    async submitVerification() {
        const content = document.querySelector('.content-input').value.trim();
        
        if (!content) {
            this.showError('请输入要核查的内容');
            return;
        }

        if (!this.selectedVerifyCategory) {
            this.showError('请选择话题分类');
            return;
        }

        // 显示加载状态
        this.showLoading();

        try {
            // 调用API进行核查
            const result = await this.callVerificationAPI(content);
            this.hideLoading();
            this.showVerificationResult(result);
        } catch (error) {
            this.hideLoading();
            this.showError('核查失败，请重试');
            console.error('API调用错误:', error);
        }
    }

    // 调用核查API
    async callVerificationAPI(content) {
        const apiUrl = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
        const apiKey = '893b9f2c-3b3c-4943-a482-5ab6dde65007';
        
        const prompt = `请对以下内容进行事实核查，分析其真实性并提供证据支持。请按照以下格式回复：

内容：${content}
分类：${this.getCategoryName(this.selectedVerifyCategory)}

请分析：
1. 真实性评估（真实/部分真实/虚假/无法证伪）
2. 主要观点分析
3. 证据来源
4. 结论和建议

请用中文回复，保持客观、准确。`;

        const requestBody = {
            model: "doubao-seed-1-6-250615",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1000,
            temperature: 0.3
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('API返回数据格式错误');
            }

            return data.choices[0].message.content;
        } catch (error) {
            console.error('API调用详细错误:', error);
            
            // 如果是网络错误，提供重试建议
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('网络连接失败，请检查网络后重试');
            }
            
            throw error;
        }
    }

    // 获取分类名称
    getCategoryName(categoryKey) {
        const categoryMap = {
            'health': '健康',
            'tech': '科技',
            'society': '社会',
            'entertainment': '娱乐',
            'other': '其他'
        };
        return categoryMap[categoryKey] || '其他';
    }

    // 显示核查结果
    showVerificationResult(apiResult = null) {
        const resultElement = document.getElementById('verification-result');
        if (resultElement) {
            if (apiResult) {
                // 解析API返回的结果
                this.updateVerificationResult(apiResult);
            }
            resultElement.style.display = 'block';
            resultElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // 更新核查结果内容
    updateVerificationResult(apiResult) {
        const resultElement = document.getElementById('verification-result');
        if (!resultElement) return;

        // 尝试解析API返回的结果
        let verificationStatus = '无法证伪';
        let statusClass = 'verified-unknown';
        
        // 根据API返回内容判断核查状态
        if (apiResult.includes('真实') || apiResult.includes('正确')) {
            verificationStatus = '真实';
            statusClass = 'verified-true';
        } else if (apiResult.includes('部分真实') || apiResult.includes('部分正确')) {
            verificationStatus = '部分真实';
            statusClass = 'verified-partial';
        } else if (apiResult.includes('虚假') || apiResult.includes('错误') || apiResult.includes('谣言')) {
            verificationStatus = '虚假';
            statusClass = 'verified-false';
        }

        // 更新状态标签
        const statusElement = resultElement.querySelector('.result-status');
        if (statusElement) {
            statusElement.textContent = verificationStatus;
            statusElement.className = `result-status ${statusClass}`;
        }

        // 更新AI分析内容
        const aiAnalysisElement = resultElement.querySelector('.ai-analysis p');
        if (aiAnalysisElement) {
            aiAnalysisElement.textContent = apiResult;
        }

        // 更新证据列表（如果API返回了结构化信息）
        this.updateEvidenceList(apiResult);
    }

    // 更新证据列表
    updateEvidenceList(apiResult) {
        const evidenceListElement = document.querySelector('.evidence-list ul');
        if (!evidenceListElement) return;

        // 清空现有列表
        evidenceListElement.innerHTML = '';

        // 尝试从API结果中提取证据信息
        const evidenceItems = [];
        
        if (apiResult.includes('权威媒体') || apiResult.includes('官方')) {
            evidenceItems.push('权威媒体报道');
        }
        if (apiResult.includes('研究') || apiResult.includes('数据')) {
            evidenceItems.push('科学研究数据');
        }
        if (apiResult.includes('专家') || apiResult.includes('学者')) {
            evidenceItems.push('专家观点支持');
        }
        if (apiResult.includes('政府') || apiResult.includes('官方')) {
            evidenceItems.push('官方声明');
        }

        // 如果没有提取到具体证据，使用默认项
        if (evidenceItems.length === 0) {
            evidenceItems.push('AI分析结果');
            evidenceItems.push('内容逻辑分析');
            evidenceItems.push('可信度评估');
        }

        // 创建证据列表项
        evidenceItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            evidenceListElement.appendChild(li);
        });
    }

    // 重置核查表单
    resetVerificationForm() {
        document.querySelector('.content-input').value = '';
        document.querySelectorAll('.category-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        this.selectedVerifyCategory = null;
        
        const resultElement = document.getElementById('verification-result');
        if (resultElement) {
            resultElement.style.display = 'none';
        }
    }

    // 重新核查
    async retryVerification() {
        const content = document.querySelector('.content-input').value.trim();
        
        if (!content) {
            this.showError('请先输入要核查的内容');
            return;
        }

        if (!this.selectedVerifyCategory) {
            this.showError('请先选择话题分类');
            return;
        }

        // 显示加载状态
        this.showLoading();

        try {
            // 调用API进行核查
            const result = await this.callVerificationAPI(content);
            this.hideLoading();
            this.showVerificationResult(result);
        } catch (error) {
            this.hideLoading();
            this.showError('重新核查失败，请重试');
            console.error('重新核查API调用错误:', error);
        }
    }

    // 设置订阅操作
    setupSubscriptionActions() {
        // 取消关注按钮
        document.querySelectorAll('.unsubscribe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleUnsubscribe(e.currentTarget);
            });
        });

        // 添加订阅按钮
        const addBtn = document.querySelector('.add-subscription-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.handleAddSubscription();
            });
        }
    }

    // 处理取消关注
    handleUnsubscribe(button) {
        const subscriptionItem = button.closest('.subscription-item');
        if (subscriptionItem) {
            subscriptionItem.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                subscriptionItem.remove();
            }, 300);
        }
    }

    // 处理添加订阅
    handleAddSubscription() {
        const topic = prompt('请输入要关注的话题：');
        if (topic) {
            this.addNewSubscription(topic);
        }
    }

    // 添加新订阅
    addNewSubscription(topic) {
        const subscriptionList = document.querySelector('.subscription-list');
        const newSubscription = document.createElement('div');
        newSubscription.className = 'subscription-item';
        newSubscription.innerHTML = `
            <div class="subscription-content">
                <h4>${topic}</h4>
                <p>关注${topic}相关话题</p>
                <span class="update-time">最新更新：刚刚</span>
            </div>
            <div class="subscription-actions">
                <button class="unsubscribe-btn">取消关注</button>
            </div>
        `;

        // 绑定取消关注事件
        const unsubscribeBtn = newSubscription.querySelector('.unsubscribe-btn');
        unsubscribeBtn.addEventListener('click', (e) => {
            this.handleUnsubscribe(e.currentTarget);
        });

        subscriptionList.appendChild(newSubscription);
    }

    // 处理语音输入
    handleVoiceInput() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'zh-CN';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                this.showVoiceIndicator('正在听取语音...');
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.querySelector('.search-input').value = transcript;
                this.handleSearch(transcript);
            };

            recognition.onerror = () => {
                this.showError('语音识别失败，请重试');
            };

            recognition.onend = () => {
                this.hideVoiceIndicator();
            };

            recognition.start();
        } else {
            this.showError('您的浏览器不支持语音识别功能');
        }
    }

    // 显示语音指示器
    showVoiceIndicator(message) {
        const indicator = document.createElement('div');
        indicator.id = 'voice-indicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 20px;
                border-radius: 15px;
                z-index: 3000;
                text-align: center;
            ">
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid #fff;
                    border-radius: 50%;
                    margin: 0 auto 15px;
                    animation: pulse 1s infinite;
                "></div>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(indicator);
        
        // 添加脉冲动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.7; }
                100% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // 隐藏语音指示器
    hideVoiceIndicator() {
        const indicator = document.getElementById('voice-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // 显示加载状态
    showLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
        
        // 更新加载提示文本
        const loadingText = loadingOverlay?.querySelector('p');
        if (loadingText) {
            loadingText.textContent = 'AI正在核查中，请稍候...';
        }
    }

    // 显示API调用状态
    showAPIStatus(status) {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            const loadingText = loadingOverlay.querySelector('p');
            if (loadingText) {
                loadingText.textContent = status;
            }
        }
    }

    // 隐藏加载状态
    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    // 显示错误信息
    showError(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #f44336;
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            z-index: 3000;
            font-size: 14px;
            font-weight: 500;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// 添加滑动动画样式
const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = `
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(-100%); }
    }
`;
document.head.appendChild(slideOutStyle);

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new FactCheckApp();
});

// 添加触摸滑动支持
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        const currentPage = document.querySelector('.page.active').id;
        let targetPage = currentPage;
        
        if (diff > 0 && currentPage === 'archive-page') {
            // 向左滑动，从档案馆到查个究竟
            targetPage = 'verify-page';
        } else if (diff > 0 && currentPage === 'verify-page') {
            // 向左滑动，从查个究竟到订阅
            targetPage = 'subscription-page';
        } else if (diff < 0 && currentPage === 'subscription-page') {
            // 向右滑动，从订阅到查个究竟
            targetPage = 'verify-page';
        } else if (diff < 0 && currentPage === 'verify-page') {
            // 向右滑动，从查个究竟到档案馆
            targetPage = 'archive-page';
        }
        
        if (targetPage !== currentPage) {
            // 触发页面切换
            const navItem = document.querySelector(`[data-page="${targetPage}"]`);
            if (navItem) {
                navItem.click();
            }
        }
    }
}
