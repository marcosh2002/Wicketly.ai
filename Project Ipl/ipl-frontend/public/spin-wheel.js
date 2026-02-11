/**
 * Spin to Win Wheel - Daily Popup System
 * Shows up to 2 times per day (12 hours gap)
 * Allows users to spin and win points
 */

class SpinToWinWheel {
  constructor(options = {}) {
    this.wheelSegments = [
      { label: 'Win 50', value: 50, color: '#FF1744' },
      { label: 'Win 100', value: 100, color: '#00E5FF' },
      { label: 'Jackpot!', value: 200, color: '#FFEA00' },
      { label: 'Win 75', value: 75, color: '#7C4DFF' },
      { label: 'Try Again', value: 0, color: '#B0BEC5' },
      { label: 'Win 150', value: 150, color: '#FF5252' },
      { label: 'Win 25', value: 25, color: '#00E676' },
      { label: 'Bonus 125', value: 125, color: '#FF6E40' }
    ];

    this.isSpinning = false;
    this.currentRotation = 0;
    this.minSpins = 5;
    this.maxSpins = 8;
    this.spinDuration = 5;
    this.onWin = options.onWin || (() => {});
    this.onClose = options.onClose || (() => {});
    this.username = options.username || null;
    this.apiBaseUrl = options.apiBaseUrl || 'http://localhost:8000';
  }

  static shouldShowPopup() {
    const now = new Date();
    const today = now.toDateString();
    const storageKey = `spinWheel_${today}`;
    const popupData = JSON.parse(localStorage.getItem(storageKey)) || {
      count: 0,
      times: []
    };

    if (popupData.count < 2) {
      return true;
    }

    if (popupData.times.length > 0) {
      const firstPopupTime = new Date(popupData.times[0]);
      const timeDiff = now - firstPopupTime;
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      return hoursDiff >= 12;
    }

    return false;
  }

  static recordPopupDisplay() {
    const now = new Date();
    const today = now.toDateString();
    const storageKey = `spinWheel_${today}`;
    let popupData = JSON.parse(localStorage.getItem(storageKey)) || {
      count: 0,
      times: []
    };

    popupData.count++;
    popupData.times.push(now.toISOString());
    localStorage.setItem(storageKey, JSON.stringify(popupData));
  }

  show() {
    if (!SpinToWinWheel.shouldShowPopup()) {
      console.log('Popup already shown 2 times today');
      return;
    }

    SpinToWinWheel.recordPopupDisplay();
    this.createWheelHTML();
    this.attachEventListeners();
  }

  createWheelHTML() {
    const container = document.createElement('div');
    container.className = 'spin-wheel-container';
    container.id = 'spinWheelContainer';

    const modal = document.createElement('div');
    modal.className = 'spin-wheel-modal';
    modal.id = 'spinWheelModal';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.id = 'spinWheelCloseBtn';

    const header = document.createElement('h2');
    header.className = 'spin-header';
    header.textContent = 'SPIN N WIN';

    const subtitle = document.createElement('p');
    subtitle.style.color = '#fff';
    subtitle.style.fontSize = '16px';
    subtitle.style.marginBottom = '20px';
    subtitle.textContent = 'Spin the wheel to win Cash Prizes';

    const wheelContainer = document.createElement('div');
    wheelContainer.style.position = 'relative';
    wheelContainer.style.display = 'inline-block';

    const pointer = document.createElement('div');
    pointer.className = 'pointer';

    const wheelSvg = this.createWheelSVG();
    const wheelDiv = document.createElement('div');
    wheelDiv.className = 'spin-wheel';
    wheelDiv.id = 'spinWheel';
    wheelDiv.appendChild(wheelSvg);

    wheelContainer.appendChild(pointer);
    wheelContainer.appendChild(wheelDiv);

    const spinButton = document.createElement('button');
    spinButton.className = 'spin-button';
    spinButton.id = 'spinButton';
    spinButton.textContent = 'SPIN NOW';

    modal.appendChild(closeBtn);
    modal.appendChild(header);
    modal.appendChild(subtitle);
    modal.appendChild(wheelContainer);
    modal.appendChild(spinButton);

    container.appendChild(modal);
    document.body.appendChild(container);
  }

  createWheelSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.setAttribute('width', '200');
    svg.setAttribute('height', '200');
    svg.classList.add('wheel-svg');

    const segmentAngle = 360 / this.wheelSegments.length;

    this.wheelSegments.forEach((segment, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;

      const path = this.createSegmentPath(100, 100, 80, startAngle, endAngle);
      path.setAttribute('fill', segment.color);
      path.setAttribute('stroke', '#fff');
      path.setAttribute('stroke-width', '2');
      svg.appendChild(path);

      const textAngle = startAngle + segmentAngle / 2;
      const textRadius = 55;
      const textX = 100 + textRadius * Math.cos((textAngle - 90) * (Math.PI / 180));
      const textY = 100 + textRadius * Math.sin((textAngle - 90) * (Math.PI / 180));

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', textX);
      text.setAttribute('y', textY);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '0.3em');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', '#000');
      text.setAttribute('transform', `rotate(${textAngle} ${textX} ${textY})`);
      text.textContent = segment.label;
      svg.appendChild(text);
    });

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '100');
    circle.setAttribute('cy', '100');
    circle.setAttribute('r', '15');
    circle.setAttribute('fill', '#fff');
    circle.setAttribute('stroke', '#ffff00');
    circle.setAttribute('stroke-width', '3');
    svg.appendChild(circle);

    return svg;
  }

  createSegmentPath(cx, cy, radius, startAngle, endAngle) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    path.setAttribute('d', pathData);
    return path;
  }

  attachEventListeners() {
    const spinButton = document.getElementById('spinButton');
    const closeBtn = document.getElementById('spinWheelCloseBtn');
    const container = document.getElementById('spinWheelContainer');

    spinButton.addEventListener('click', () => this.spin());
    closeBtn.addEventListener('click', () => this.close());
    container.addEventListener('click', (e) => {
      if (e.target === container) {
        this.close();
      }
    });
  }

  spin() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    const spinButton = document.getElementById('spinButton');
    spinButton.disabled = true;
    spinButton.classList.add('spinning');

    const numSpins = Math.floor(Math.random() * (this.maxSpins - this.minSpins + 1)) + this.minSpins;
    const randomSegment = Math.floor(Math.random() * this.wheelSegments.length);

    const segmentAngle = 360 / this.wheelSegments.length;
    const stopAngle = randomSegment * segmentAngle + segmentAngle / 2;
    const finalRotation = numSpins * 360 + stopAngle;

    const wheel = document.getElementById('spinWheel');
    wheel.style.setProperty('--rotation', `${this.currentRotation}deg`);
    wheel.style.setProperty('--final-rotation', `${finalRotation}deg`);

    wheel.classList.add('stopping');
    wheel.style.transform = `rotate(${finalRotation}deg)`;

    this.currentRotation = finalRotation;

    setTimeout(() => {
      this.isSpinning = false;
      spinButton.disabled = false;
      spinButton.classList.remove('spinning');

      const winningSegment = this.wheelSegments[randomSegment];
      this.showCongratulations(winningSegment);
    }, this.spinDuration * 1000);
  }

  showCongratulations(segment) {
    const container = document.createElement('div');
    container.className = 'congratulations-modal';
    container.id = 'congratulationsModal';

    const content = document.createElement('div');
    content.className = 'congratulations-content';

    for (let i = 1; i <= 10; i++) {
      const confetti = document.createElement('div');
      confetti.className = `confetti confetti-${i}`;
      confetti.style.left = Math.random() * 100 + '%';
      content.appendChild(confetti);
    }

    const congratsText = document.createElement('h2');
    congratsText.className = 'congratulations-text';
    congratsText.textContent = '🎉 CONGRATULATIONS! 🎉';

    const pointsDisplay = document.createElement('div');
    pointsDisplay.className = 'points-display';
    pointsDisplay.textContent = `+${segment.value}`;

    const pointsLabel = document.createElement('p');
    pointsLabel.className = 'points-label';
    pointsLabel.textContent = segment.label;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-congratulations-btn';
    closeBtn.textContent = 'Claim Reward';

    content.appendChild(congratsText);
    content.appendChild(pointsDisplay);
    content.appendChild(pointsLabel);
    content.appendChild(closeBtn);

    container.appendChild(content);
    document.body.appendChild(container);

    closeBtn.addEventListener('click', () => {
      this.claimReward(segment.value, segment.label);
      container.remove();
      this.close();
    });

    container.addEventListener('click', (e) => {
      if (e.target === container) {
        container.remove();
        this.close();
      }
    });

    this.onWin(segment.value, segment.label);
  }

  async claimReward(points, label) {
    if (!this.username) {
      console.log('Username not set, skipping API call');
      return;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/spin-wheel/claim-reward?username=${this.username}&points=${points}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.ok) {
        console.log('Reward claimed successfully:', data);
        window.dispatchEvent(new CustomEvent('spin-reward-claimed', { 
          detail: { 
            points: points, 
            newBalance: data.new_balance 
          } 
        }));
      } else {
        console.error('Error claiming reward:', data.error);
      }
    } catch (error) {
      console.error('Error calling API:', error);
    }
  }

  close() {
    const container = document.getElementById('spinWheelContainer');
    if (container) {
      container.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => container.remove(), 300);
    }
    this.onClose();
  }
}

function initializeSpinWheel(options = {}) {
  const wheel = new SpinToWinWheel({
    onWin: (points, label) => {
      console.log(`User won ${points} points!`, label);
      if (options.onWin) {
        options.onWin(points, label);
      }
    },
    onClose: () => {
      console.log('Spin wheel closed');
      if (options.onClose) {
        options.onClose();
      }
    },
    username: options.username || null,
    apiBaseUrl: options.apiBaseUrl || 'http://localhost:8000'
  });

  wheel.show();
  return wheel;
}

function scheduleSpinWheelPopups(options = {}) {
  if (SpinToWinWheel.shouldShowPopup()) {
    setTimeout(() => {
      initializeSpinWheel(options);
    }, 1000);
  }

  setInterval(() => {
    if (SpinToWinWheel.shouldShowPopup()) {
      initializeSpinWheel(options);
    }
  }, 60 * 60 * 1000);
}

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SpinToWinWheel, initializeSpinWheel, scheduleSpinWheelPopups };
}
