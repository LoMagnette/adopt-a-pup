import {Component, signal, computed, effect, input, linkedSignal, output, model} from '@angular/core';


export type AnimationState = 'running' | 'happy' | 'thinking' | 'rolling' | 'standing';

@Component({
  selector: 'app-dog-animation',
  standalone: true,
  imports: [],
  template: `
    <div class="animation-container">
      <!-- Dog House - shown initially, hidden after running phase -->
      @if (showDogHouse()) {
        <div class="dog-house">
          <img src="pixel-art/dog-house.png" alt="Dog House" />
        </div>
      }

      <!-- Animated Dog -->
      <div
          class="dog"
          [style.right.px]="rightPosition()"
          [class.running]="animationState() === 'running'"
          [class.happy]="animationState() === 'happy'"
          [class.thinking]="animationState() === 'thinking'"
          [class.rolling]="animationState() === 'rolling'"
          [class.standing]="animationState() === 'standing'"
          (click)="dogClicked()"
      >
        <img [src]="currentImage()" [alt]="animationState() + ' dog'" />
      </div>
    </div>
  `,
  styles: `
    .animation-container {
      position: relative;
      height: 160px;
      background: transparent;
      margin: 20px auto;
      overflow: visible;
    }

    .dog-house {
      position: absolute;
      right: 0px;
      bottom: 0px;
      z-index: 1;
    }

    .dog-house img {
      width: 200px;
      height: auto;
      image-rendering: pixelated;
      image-rendering: -moz-crisp-edges;
      image-rendering: crisp-edges;
    }

    .dog {
      position: absolute;
      right: 0px;
      bottom: 0px;
      transition: right 0.2s linear;
      z-index: 2;
    }

    .dog img {
      width: 150px;
      height: auto;
      image-rendering: pixelated;
      image-rendering: -moz-crisp-edges;
      image-rendering: crisp-edges;
    }

    .dog.running {
      /* Running animation specific styles */
    }

    .dog.happy {
      /* Happy state - no movement */
      transition: none;
    }

    .dog.thinking {
      /* Thinking state - no animation */
      transition: none;
    }

    .dog.rolling {
      /* Rolling state - no movement */
      transition: none;
    }

    .dog.standing {
      /* Standing state - no movement */
      transition: none;
    }
  `
})
export class DogAnimationComponent {
  // Signals for state management
  state = input<AnimationState>('running');
  animationState = linkedSignal<AnimationState>(() => this.state());
  showDogHouse = signal(true);
  currentFrame = signal(0);
  rightPosition = signal(0);

  talking = model<boolean>(false);

  // Computed signal for current image path
  currentImage = computed(() => {
    const state = this.animationState();
    const frame = this.currentFrame();

    if (state === 'running') {
      return frame % 2 === 0
        ? 'pixel-art/qaly.running-1.png'
        : 'pixel-art/qaly.running-2.png';
    } else if (state === 'happy') {
      return frame % 2 === 0
        ? 'pixel-art/qaly.happy.png'
        : 'pixel-art/qaly.happy-2.png';
    } else if (state === 'rolling') {
      return frame % 2 === 0
        ? 'pixel-art/qaly.rolling-1.png'
        : 'pixel-art/qaly.rolling-2.png';
    } else if (state === 'standing') {
      return frame % 2 === 0
        ? 'pixel-art/qaly.standing-1.png'
        : 'pixel-art/qaly.standing-2.png';
    } else if (state === 'thinking') {
      return frame % 2 === 0
        ? 'pixel-art/qaly.thinking.png'
        : 'pixel-art/qaly.thinking-2.png';
    } else {
      return 'pixel-art/qaly.thinking.png';
    }
  });

  constructor() {
    this.talking.set(false);
    this.startAnimation();
    effect(
        () => {
          const position = this.animationState();
          console.log(position);
          if(position === 'thinking') {
            this.switchToThinking();
          }else if(position === 'happy') {
            this.switchToHappy();
          }

        }
    )

  }

  private startAnimation() {
    // Running animation phase (first 3 seconds)
    const runningInterval = setInterval(() => {
      this.currentFrame.update(f => f + 1);
      this.rightPosition.update(pos => pos + 5); // Move left (increase right position)
    }, 200); // Change frame every 200ms

    // After 3 seconds, hide dog house and switch to happy
    setTimeout(() => {
      clearInterval(runningInterval);
      this.showDogHouse.set(false);
      this.animationState.set('happy');

      // Happy animation (alternating frames but no movement)
      setInterval(() => {
        this.currentFrame.update(f => f + 1);
      }, 400); // Slower animation for happy state
    }, 3000);
  }

  // Method to switch to thinking state
  switchToThinking() {
    this.animationState.set('thinking');
  }

  // Method to switch back to happy state
  switchToHappy() {
    this.animationState.set('happy');
  }

  // Method to switch to rolling state
  switchToRolling() {
    this.animationState.set('rolling');
  }

  // Method to switch to standing state
  switchToStanding() {
    this.animationState.set('standing');
  }

  protected dogClicked() {
    this.talking.update( t => !t);
    this.animationState.set(this.talking()? 'standing' : 'happy');
  }
}
