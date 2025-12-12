import {Component, signal, effect, input, linkedSignal, model, ChangeDetectionStrategy} from '@angular/core';


export type AnimationState = 'running' | 'happy' | 'thinking' | 'rolling' | 'standing';

@Component({
  selector: 'app-dog-animation',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animation-container">
      <!-- Dog House - shown initially, hidden after running phase -->
      @if (showDogHouse()) {
        <div class="dog-house">
          <img src="pixel-art/dog-house.png" alt="Dog House" />
        </div>
      }

      <!-- Animated Dog with all frames preloaded -->
      <div
          class="dog"
          [style.right.px]="rightPosition()"
          [class.running]="animationState() === 'running'"
          [class.happy]="animationState() === 'happy'"
          [class.thinking]="animationState() === 'thinking'"
          [class.rolling]="animationState() === 'rolling'"
          [class.standing]="animationState() === 'standing'"
          [class.frame-1]="currentFrame() % 2 === 0"
          [class.frame-2]="currentFrame() % 2 === 1"
          (click)="dogClicked()"
      >
        <!-- Preload all images as hidden elements -->
        <img class="dog-frame running-1" src="pixel-art/qaly.running-1.png" alt="running 1" />
        <img class="dog-frame running-2" src="pixel-art/qaly.running-2.png" alt="running 2" />
        <img class="dog-frame happy-1" src="pixel-art/qaly.happy.png" alt="happy 1" />
        <img class="dog-frame happy-2" src="pixel-art/qaly.happy-2.png" alt="happy 2" />
        <img class="dog-frame rolling-1" src="pixel-art/qaly.rolling-1.png" alt="rolling 1" />
        <img class="dog-frame rolling-2" src="pixel-art/qaly.rolling-2.png" alt="rolling 2" />
        <img class="dog-frame standing-1" src="pixel-art/qaly.standing-1.png" alt="standing 1" />
        <img class="dog-frame standing-2" src="pixel-art/qaly.standing-2.png" alt="standing 2" />
        <img class="dog-frame thinking-1" src="pixel-art/qaly.thinking.png" alt="thinking 1" />
        <img class="dog-frame thinking-2" src="pixel-art/qaly.thinking-2.png" alt="thinking 2" />
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
      right: 0;
      bottom: 0;
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
      right: 0;
      bottom: 0;
      transition: right 0.2s linear;
      z-index: 2;
      width: 150px;
      height: 150px;
    }

    .dog-frame {
      position: absolute;
      top: 0;
      left: 0;
      width: 150px;
      height: auto;
      image-rendering: pixelated;
      image-rendering: -moz-crisp-edges;
      image-rendering: crisp-edges;
      display: none;
    }

    /* Show frame 1 variants */
    .dog.running.frame-1 .running-1,
    .dog.happy.frame-1 .happy-1,
    .dog.thinking.frame-1 .thinking-1,
    .dog.rolling.frame-1 .rolling-1,
    .dog.standing.frame-1 .standing-1 {
      display: block;
    }

    /* Show frame 2 variants */
    .dog.running.frame-2 .running-2,
    .dog.happy.frame-2 .happy-2,
    .dog.thinking.frame-2 .thinking-2,
    .dog.rolling.frame-2 .rolling-2,
    .dog.standing.frame-2 .standing-2 {
      display: block;
    }

    .dog.happy, .dog.thinking, .dog.rolling, .dog.standing {
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

  constructor() {
    this.talking.set(false);
    this.startAnimation();
    effect(
        () => {
          const position = this.animationState();
          //console.log(position);
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
