/**
 * 스크롤 등장 효과: .reveal 요소가 화면에 들어오면 .is-in 을 붙입니다.
 */
document.documentElement.classList.remove('no-js');

function init() {
  // reveal-on-scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            ro.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    reveals.forEach((r) => ro.observe(r));
  } else {
    reveals.forEach((r) => r.classList.add('is-in'));
  }
}

init();
