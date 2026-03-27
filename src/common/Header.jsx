import React, { useEffect, useRef } from 'react';
import gsap from "gsap";

function Header() {

  const messageRef = useRef(null);

  useEffect(() => {
    const textElement = messageRef.current;
    if (!textElement) return;
    const text = textElement.textContent;

    // 글자 하나하나를 <span>으로 감싸기
    textElement.innerHTML = text.split("").map(char => {
      if (char === " ") return "&nbsp;";
      return `<span class="char">${char}</span>`;
    }).join("");

    const chars = textElement.querySelectorAll(".char");

    gsap.from(chars, {
      duration: 2,
      opacity: 0,
      y: 20,
      stagger: 0.05
    });
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번 실행

    return (
        <header className='header'>
            <h1 className='project-title' ref={messageRef}>Search Recipe</h1>
        </header>
    );
}

export default Header;