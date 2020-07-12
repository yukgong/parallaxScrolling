const body = document.querySelector('body');

(() => {
    let yOffset = 0; // window.pageYOffset -> 현재 스크롤 위치
    let prevScrollHeight = 0; // 이전 씬의 스크롤 높이
    let currentSection = 0; // 현재 씬 인덱스 값
    // 각 씬의 객체 생성
    const sectionInfo = [{
            // 0
            type: 'sticky', // 스크롤 타입
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-sec-0'),
            }
        },
        { // 1
            type: 'sticky', // 스크롤 타입
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-sec-1'),
            }
        }
    ];

    //스크롤할 높이 정의하기
    function setLayout() {

        for (let i = 0; i < sectionInfo.length; i++) {
            sectionInfo[i].scrollHeight = sectionInfo[i].heightNum * window.innerHeight;

            sectionInfo[i].objs.container.style.height = `${sectionInfo[i].scrollHeight}px`;
        }
        let totalScrollHeight = 0;
        yOffset = window.pageYOffset;

        for (let i = 0; i < sectionInfo.length; i++) {
            totalScrollHeight += sectionInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentSection = i;
                break;
            }
        }
        // 바디에 currentSection 갱신 
        document.body.setAttribute('id', `show-sec-${currentSection}`);
    }

    //활성화할 씬 선택하기
    function activeSection() {
        // 이전 스크롤 높이 초기화
        prevScrollHeight = 0;

        // prevScrollHeight 설정
        for (let i = 0; i < currentSection; i++) {
            prevScrollHeight += sectionInfo[i].scrollHeight;
        }
        if (yOffset > prevScrollHeight + sectionInfo[currentSection].scrollHeight) {
            currentSection++;
            // 바디에 currentScene 갱신 
            document.body.setAttribute('id', `show-sec-${currentSection}`);
        }

        if (yOffset < prevScrollHeight) {
            if (currentSection === 0) { return; }
            // 브라우저 바운스 효과로 인해 마이너스 되는 것을 방지(모바일)
            currentSection--;
            // 바디에 currentScene 갱신 
            document.body.setAttribute('id', `show-sec-${currentSection}`);
        }

        console.log(currentSection);
    }

    // 화면의 사이즈가 바뀔 때 마다, 스크롤 높이를 정의하는 이벤트 실행
    window.addEventListener('load', setLayout);
    window.addEventListener('resize', setLayout);
    // 스크롤시 활성화할 씬 선택
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        activeSection();
    });
})();