// 動畫控制類別
class AnimationController {
    private observer: IntersectionObserver;
    private navElement: HTMLElement | null;
    private animatedElements: Set<HTMLElement>;

    constructor() {
        this.navElement = document.getElementById('navbar');
        this.animatedElements = new Set();
        this.initIntersectionObserver();
        this.initScrollEffects();
        this.initPageLoadAnimations();
    }

    // 初始化 Intersection Observer 用於滾動動畫
    private initIntersectionObserver(): void {
        const options: IntersectionObserverInit = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry: IntersectionObserverEntry) => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target as HTMLElement)) {
                    this.animateElement(entry.target as HTMLElement);
                    this.animatedElements.add(entry.target as HTMLElement);
                }
            });
        }, options);

        // 觀察需要動畫的元素
        const elementsToAnimate: NodeListOf<HTMLElement> = document.querySelectorAll(
            '#aboutContent, #photoContainer, #contactContent'
        );
        elementsToAnimate.forEach((el: HTMLElement) => {
            this.observer.observe(el);
        });
    }

    // 初始化滾動效果
    private initScrollEffects(): void {
        let lastScrollY: number = 0;
        let ticking: boolean = false;

        const handleScroll = (): void => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY: number = window.scrollY;
                    
                    // 導覽列滾動效果
                    if (this.navElement) {
                        if (currentScrollY > 50) {
                            this.navElement.classList.add('scrolled');
                        } else {
                            this.navElement.classList.remove('scrolled');
                        }
                    }

                    // 平滑滾動到錨點
                    this.handleSmoothScroll();

                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // 處理平滑滾動
    private handleSmoothScroll(): void {
        const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.nav-links a');
        navLinks.forEach((link: HTMLAnchorElement) => {
            link.addEventListener('click', (e: Event) => {
                e.preventDefault();
                const targetId: string | null = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetElement: HTMLElement | null = document.querySelector(targetId);
                    if (targetElement) {
                        const navHeight: number = this.navElement?.offsetHeight || 0;
                        const targetPosition: number = targetElement.offsetTop - navHeight;
                        
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
    private initPageLoadAnimations(): void {
        window.addEventListener('load', () => {
            const heroContent: HTMLElement | null = document.getElementById('heroContent');
            if (heroContent) {
                setTimeout(() => {
                    heroContent.classList.add('animate');
                }, 100);
            }
        });
    }

    // 動畫元素
    private animateElement(element: HTMLElement): void {
        // 為每個子元素添加延遲動畫
        const children: HTMLCollectionOf<Element> = element.children;
        Array.from(children).forEach((child: Element, index: number) => {
            const childElement = child as HTMLElement;
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
    }

    // 添加照片懸停動畫
    public initPhotoAnimations(): void {
        const photoItems: NodeListOf<HTMLElement> = document.querySelectorAll('.photo-item');
        photoItems.forEach((item: HTMLElement) => {
            // 滑鼠移入：開始左右晃動
            item.addEventListener('mouseenter', () => {
                item.classList.add('wobble');
            });

            // 滑鼠移出：停止左右晃動
            item.addEventListener('mouseleave', () => {
                item.classList.remove('wobble');
            });
        });
    }

    // 照片懸停動畫
    private animatePhotoHover(element: HTMLElement, isEntering: boolean): void {
        // 保留方法，不再使用 Y 軸移動，改由 CSS keyframes 控制左右晃動
        if (isEntering) {
            element.classList.add('wobble');
        } else {
            element.classList.remove('wobble');
        }
    }

    // 添加聯絡項目動畫
    public initContactAnimations(): void {
        const contactItems: NodeListOf<HTMLElement> = document.querySelectorAll('.contact-item');
        contactItems.forEach((item: HTMLElement) => {
            item.addEventListener('mouseenter', () => {
                this.animateContactHover(item, true);
            });
            
            item.addEventListener('mouseleave', () => {
                this.animateContactHover(item, false);
            });
        });
    }

    // 聯絡項目懸停動畫
    private animateContactHover(element: HTMLElement, isEntering: boolean): void {
        if (isEntering) {
            element.style.transform = 'translateY(-5px)';
            element.style.transition = 'transform 0.3s ease, background 0.3s ease';
        } else {
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

