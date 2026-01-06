// 動畫控制類別
class AnimationController {
    constructor() {
        this.navElement = document.getElementById('navbar');
        this.animatedElements = new Set();
        this.initIntersectionObserver();
        this.initScrollEffects();
        this.initPageLoadAnimations();
    }
    // 初始化 Intersection Observer 用於滾動動畫
    initIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, options);
        // 觀察需要動畫的元素
        const elementsToAnimate = document.querySelectorAll('#aboutContent, #photoContainer, #contactContent');
        elementsToAnimate.forEach((el) => {
            this.observer.observe(el);
        });
    }
    // 初始化滾動效果
    initScrollEffects() {
        let lastScrollY = 0;
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    // 導覽列滾動效果
                    if (this.navElement) {
                        if (currentScrollY > 50) {
                            this.navElement.classList.add('scrolled');
                        }
                        else {
                            this.navElement.classList.remove('scrolled');
                        }
                    }
                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        this.handleSmoothScroll();
    }
    // 處理平滑滾動
    handleSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const navHeight = this.navElement?.offsetHeight || 0;
                        const targetPosition = targetElement.offsetTop - navHeight;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    // 初始化頁面載入動畫
    initPageLoadAnimations() {
        window.addEventListener('load', () => {
            const heroContent = document.getElementById('heroContent');
            if (heroContent) {
                setTimeout(() => {
                    heroContent.classList.add('animate');
                }, 100);
            }
        });
    }
    // 動畫元素
    animateElement(element) {
        // 為每個子元素添加延遲動畫
        const children = element.children;
        Array.from(children).forEach((child, index) => {
            const childElement = child;
            setTimeout(() => {
                childElement.style.opacity = '0';
                childElement.style.transform = 'translateY(20px)';
                childElement.style.transition = 'all 0.6s ease';
                requestAnimationFrame(() => {
                    childElement.style.opacity = '1';
                    childElement.style.transform = 'translateY(0)';
                });
            }, index * 100);
        });
        // 為元素本身添加動畫類
        element.classList.add('animate');
    }
    // 添加照片懸停動畫
    initPhotoAnimations() {
        const photoItems = document.querySelectorAll('.photo-item');
        photoItems.forEach((item) => {
            // 滑鼠移入：開始左右晃動
            item.addEventListener('mouseenter', () => {
                item.classList.add('wobble');
            });
            item.addEventListener('mouseleave', () => {
                item.classList.remove('wobble');
            });
        });
    }
    // 照片懸停動畫
    animatePhotoHover(element, isEntering) {
        if (isEntering) {
            element.style.transform = 'translateY(-10px) scale(1.05)';
            element.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        }
        else {
            element.style.transform = 'translateY(0) scale(1)';
        }
    }
    // 添加聯絡項目動畫
    initContactAnimations() {
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach((item) => {
            item.addEventListener('mouseenter', () => {
                this.animateContactHover(item, true);
            });
            item.addEventListener('mouseleave', () => {
                this.animateContactHover(item, false);
            });
        });
    }
    // 聯絡項目懸停動畫
    animateContactHover(element, isEntering) {
        if (isEntering) {
            element.style.transform = 'translateY(-5px)';
            element.style.transition = 'transform 0.3s ease, background 0.3s ease';
        }
        else {
            element.style.transform = 'translateY(0)';
        }
    }
}
// 頁面載入完成後初始化動畫控制器
document.addEventListener('DOMContentLoaded', () => {
    const animationController = new AnimationController();
    animationController.initPhotoAnimations();
    animationController.initContactAnimations();
});
// 視窗大小改變時的處理
window.addEventListener('resize', () => {
    // 可以添加響應式相關的動畫調整
    console.log('視窗大小已改變');
});

