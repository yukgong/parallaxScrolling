const body = document.querySelector('body');

(() => {
    let yOffset = 0; // window.pageYOffset -> 현재 스크롤 위치
    let prevScrollHeight = 0; // 이전 씬의 스크롤 높이
    let currentSection = 0; // 현재 씬 인덱스 값
    let enterNewScene = false; // 새로운 씬이 시작되는 순간 true로 바뀔 변수

    // 각 씬의 객체 생성
    const sectionInfo = [{
            // 0
            type: 'sticky', // 스크롤 타입
            heightNum: 3, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-sec-0'),
                msgA: document.querySelector("#scroll-sec-0 .a"),
            },
            values: {
                msgA_opacity_fadeIn: [0, 1, { start: 0.35, end: 0.5 }],
                msgA_opacity_fadeOut: [1, 0, { start: 0.8, end: 0.9 }],
                msgA_transY_fadeIn: [20, 0, { start: 0.35, end: 0.5 }],
                msgA_transY_fadeOut: [0, -20, { start: 0.8, end: 0.9 }],
            }
        },
        { // 1
            type: 'sticky', // 스크롤 타입
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-sec-1'),
                msgA: document.querySelector("#scroll-sec-1 .a"),
                msgB: document.querySelector("#scroll-sec-1 .b"),
                msgC: document.querySelector("#scroll-sec-1 .c"),
                msgD: document.querySelector("#scroll-sec-1 .d"),
                msgE: document.querySelector("#scroll-sec-1 .e"),
            },
            values: {
                msgA_opacity_fadeIn: [0, 1, { start: 0, end: 0.05 }],
                msgB_opacity_fadeIn: [0, 1, { start: 0.2, end: 0.25 }],
                msgC_opacity_fadeIn: [0, 1, { start: 0.4, end: 0.45 }],
                msgD_opacity_fadeIn: [0, 1, { start: 0.6, end: 0.65 }],
                msgE_opacity_fadeIn: [0, 1, { start: 0.8, end: 0.85 }],

                msgA_opacity_fadeOut: [1, 0, { start: 0.15, end: 0.2 }],
                msgB_opacity_fadeOut: [1, 0, { start: 0.35, end: 0.4 }],
                msgC_opacity_fadeOut: [1, 0, { start: 0.55, end: 0.6 }],
                msgD_opacity_fadeOut: [1, 0, { start: 0.75, end: 0.8 }],
                msgE_opacity_fadeOut: [1, 0, { start: 0.95, end: 1 }],

                msgA_transY_fadeIn: [20, 0, { start: 0, end: 0.05 }],
                msgB_transY_fadeIn: [20, 0, { start: 0.2, end: 0.25 }],
                msgC_transY_fadeIn: [20, 0, { start: 0.4, end: 0.45 }],
                msgD_transY_fadeIn: [20, 0, { start: 0.6, end: 0.65 }],
                msgE_transY_fadeIn: [20, 0, { start: 0.8, end: 0.85 }],

                msgA_transY_fadeOut: [0, -20, { start: 0.15, end: 0.2 }],
                msgB_transY_fadeOut: [0, -20, { start: 0.35, end: 0.4 }],
                msgC_transY_fadeOut: [0, -20, { start: 0.55, end: 0.6 }],
                msgD_transY_fadeOut: [0, -20, { start: 0.75, end: 0.8 }],
                msgE_transY_fadeOut: [0, -20, { start: 0.95, end: 1 }],
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
        enterNewScene = false;
        prevScrollHeight = 0;

        // prevScrollHeight 설정
        for (let i = 0; i < currentSection; i++) {
            prevScrollHeight += sectionInfo[i].scrollHeight;
        }
        if (yOffset > prevScrollHeight + sectionInfo[currentSection].scrollHeight) {
            enterNewScene = true;
            currentSection++;
            // 바디에 currentScene 갱신 
            document.body.setAttribute('id', `show-sec-${currentSection}`);
        }

        if (yOffset < prevScrollHeight) {
            enterNewScene = true;
            if (currentSection === 0) { return; }
            // 브라우저 바운스 효과로 인해 마이너스 되는 것을 방지(모바일)
            currentSection--;
            // 바디에 currentScene 갱신 
            document.body.setAttribute('id', `show-sec-${currentSection}`);
        }
        // 씬이 바뀌는 순간에는 애니메이션을 잠깐 멈춘다.
        if (enterNewScene) return;
        playAnimation();

    }

    // 현재 씬에서 [스크롤된 범위]를 비율로 구하는 함수
    function calcValues(values, currentYoffset) {
        let returnValue;

        const scrollHeight = sectionInfo[currentSection].scrollHeight;
        const scrollRatio = currentYoffset / scrollHeight;

        if (values.length === 3) {
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            // START ~ END 구간
            // messageA 구간에서의 현재 스크롤 비율 구하기 - 초록선 / 빨간선
            if (currentYoffset >= partScrollStart && currentYoffset <= partScrollEnd) {
                returnValue = (currentYoffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0]
            }

            // START 구간 이전이라면, values = 0					
            else if (currentYoffset < partScrollStart) {
                returnValue = values[0];
            }

            // END 구간을 넘어갔다면, values = 1	
            else if (currentYoffset > partScrollEnd) {
                returnValue = values[1];
            }

            // 각 씬의 values에 정의된 범위 안에서 비율이 계산되도록 계산한다.
        } else {
            returnValue = scrollRatio * (values[1] - values[0]) + values[0];
        }

        return returnValue;
    }

    //스크롤 애니메이션 실행 함수
    function playAnimation() {
        const objs = sectionInfo[currentSection].objs;
        const values = sectionInfo[currentSection].values;
        const currentYoffset = yOffset - prevScrollHeight;
        const scrollHeight = sectionInfo[currentSection].scrollHeight
        const scrollRatio = currentYoffset / scrollHeight;

        console.log(currentSection);
        switch (currentSection) {
            case 0:
                if (scrollRatio <= 0.75) {
                    objs.msgA.style.opacity = calcValues(values.msgA_opacity_fadeIn, currentYoffset);
                    objs.msgA.style.transform = `translate3d(0, ${calcValues(values.msgA_transY_fadeIn, currentYoffset)}%, 0)`;
                } else {
                    objs.msgA.style.opacity = calcValues(values.msgA_opacity_fadeOut, currentYoffset);
                    objs.msgA.style.transform = `translate3d(0, ${calcValues(values.msgA_transY_fadeOut, currentYoffset)}%, 0)`;
                }
                break;

            case 1:
                if (scrollRatio <= 0.1) {
                    objs.msgA.style.opacity = calcValues(values.msgA_opacity_fadeIn, currentYoffset);
                    objs.msgA.style.transform = `translate3d(0, ${calcValues(values.msgA_transY_fadeIn, currentYoffset)}%, 0)`;
                } else {
                    objs.msgA.style.opacity = calcValues(values.msgA_opacity_fadeOut, currentYoffset);
                    objs.msgA.style.transform = `translate3d(0, ${calcValues(values.msgA_transY_fadeOut, currentYoffset)}%, 0)`;
                }

                if (scrollRatio <= 0.3) {
                    objs.msgB.style.opacity = calcValues(values.msgB_opacity_fadeIn, currentYoffset);
                    objs.msgB.style.transform = `translate3d(0, ${calcValues(values.msgB_transY_fadeIn, currentYoffset)}%, 0)`;
                } else {
                    objs.msgB.style.opacity = calcValues(values.msgB_opacity_fadeOut, currentYoffset);
                    objs.msgB.style.transform = `translate3d(0, ${calcValues(values.msgB_transY_fadeOut, currentYoffset)}%, 0)`;
                }

                if (scrollRatio <= 0.5) {
                    objs.msgC.style.opacity = calcValues(values.msgC_opacity_fadeIn, currentYoffset);
                    objs.msgC.style.transform = `translate3d(0, ${calcValues(values.msgC_transY_fadeIn, currentYoffset)}%, 0)`;
                } else {
                    objs.msgC.style.opacity = calcValues(values.msgC_opacity_fadeOut, currentYoffset);
                    objs.msgC.style.transform = `translate3d(0, ${calcValues(values.msgC_transY_fadeOut, currentYoffset)}%, 0)`;
                }

                if (scrollRatio <= 0.7) {
                    objs.msgD.style.opacity = calcValues(values.msgD_opacity_fadeIn, currentYoffset);
                    objs.msgD.style.transform = `translate3d(0, ${calcValues(values.msgD_transY_fadeIn, currentYoffset)}%, 0)`;
                } else {
                    objs.msgD.style.opacity = calcValues(values.msgD_opacity_fadeOut, currentYoffset);
                    objs.msgD.style.transform = `translate3d(0, ${calcValues(values.msgD_transY_fadeOut, currentYoffset)}%, 0)`;
                }

                if (scrollRatio <= 0.9) {
                    objs.msgE.style.opacity = calcValues(values.msgE_opacity_fadeIn, currentYoffset);
                    objs.msgE.style.transform = `translate3d(0, ${calcValues(values.msgE_transY_fadeIn, currentYoffset)}%, 0)`;
                } else {
                    objs.msgE.style.opacity = calcValues(values.msgE_opacity_fadeOut, currentYoffset);
                    objs.msgE.style.transform = `translate3d(0, ${calcValues(values.msgE_transY_fadeOut, currentYoffset)}%, 0)`;
                }
                break;

        }
    }

    // 스크롤시 활성화할 씬 선택
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        activeSection();
    });

    // 화면의 사이즈가 바뀔 때 마다, 스크롤 높이를 정의하는 이벤트 실행
    window.addEventListener('load', setLayout);
    window.addEventListener('resize', setLayout);

})();