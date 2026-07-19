# UI/UX Implementation Guide

## 🚀 New Components & Utilities

This guide shows you how to use the new UI/UX components and utilities in your application.

---

## 📦 Components Created

### 1. **EmptyState** Component
Display helpful empty states when no content is available.

**Usage:**
```jsx
import EmptyState from '../components/EmptyState';

// In your component
<EmptyState
  type="history"
  title="No architectures yet"
  description="Start by generating your first architecture"
  actionLabel="Generate Now"
  onAction={() => navigate('/generate')}
/>
```

**Props:**
- `type`: 'default' | 'search' | 'error' | 'history'
- `title`: Custom title
- `description`: Custom description
- `actionLabel`: Button text
- `onAction`: Button click handler
- `icon`: Custom icon component
- `className`: Additional CSS classes

**Example Use Cases:**
- Empty version history
- No search results
- Failed data loading
- First-time user experience

---

### 2. **SkeletonLoader** Component
Show loading placeholders for better perceived performance.

**Usage:**
```jsx
import SkeletonLoader from '../components/SkeletonLoader';

{isLoading ? (
  <SkeletonLoader type="card" count={3} />
) : (
  <RealContent />
)}
```

**Types:**
- `text`: Text lines
- `card`: Full card layout
- `table`: Table layout
- `avatar`: Avatar + text
- `image`: Image placeholder

---

### 3. **ProgressBar** Component
Animated progress indicator for uploads/generation.

**Usage:**
```jsx
import ProgressBar from '../components/ProgressBar';

<ProgressBar
  progress={uploadProgress}
  label="Generating architecture..."
  color="blue"
  animated={true}
  showPercentage={true}
/>
```

---

### 4. **Tooltip** Component
Accessible tooltips with keyboard support.

**Usage:**
```jsx
import Tooltip from '../components/Tooltip';

<Tooltip content="This field is required" position="top">
  <Label>Project Name</Label>
</Tooltip>
```

---

## 🎣 Custom Hooks

### 1. **useKeyboardShortcut**
Add keyboard shortcuts to your app.

**Usage:**
```jsx
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';

// Ctrl+S to save
useKeyboardShortcut('s', handleSave, { ctrl: true, preventDefault: true });

// Enter to submit
useKeyboardShortcut('Enter', handleSubmit);

// Escape to close modal
useKeyboardShortcut('Escape', () => setModalOpen(false));
```

---

### 2. **useLocalStorage**
Persist state to localStorage with automatic JSON parsing.

**Usage:**
```jsx
import useLocalStorage from '../hooks/useLocalStorage';

const [theme, setTheme] = useLocalStorage('theme', 'light');
const [settings, setSettings] = useLocalStorage('settings', {
  notifications: true,
  autoSave: false
});
```

**Features:**
- Automatic JSON serialization
- Syncs across tabs
- SSR-safe
- Error handling

---

### 3. **useIntersectionObserver**
Detect when elements enter viewport (lazy loading, animations).

**Usage:**
```jsx
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const [ref, isVisible] = useIntersectionObserver({
  threshold: 0.5,
  freezeOnceVisible: true
});

return (
  <div ref={ref} className={isVisible ? 'animate-fade-in' : 'opacity-0'}>
    Content here
  </div>
);
```

---

## 🛠️ Utility Functions

### 1. **Debounce & Throttle**
Optimize performance for frequent events.

**Usage:**
```jsx
import { debounce, throttle } from '../utils/debounce';

// Debounce search input
const handleSearch = debounce((value) => {
  fetchResults(value);
}, 300);

// Throttle scroll handler
const handleScroll = throttle(() => {
  updateScrollPosition();
}, 100);
```

---

### 2. **Accessibility Utilities**
Improve accessibility compliance.

**Usage:**
```jsx
import {
  announceToScreenReader,
  trapFocus,
  prefersReducedMotion,
  manageFocus
} from '../utils/accessibility';

// Announce to screen readers
announceToScreenReader('Architecture generated successfully!', 'polite');

// Trap focus in modal
useEffect(() => {
  if (isModalOpen) {
    return trapFocus(modalRef.current);
  }
}, [isModalOpen]);

// Check user motion preference
const animationDuration = prefersReducedMotion() ? 0 : 300;

// Manage focus programmatically
manageFocus('main-content', true);
```

---

## 📝 Implementation Examples

### Example 1: Enhanced Form with Validation

```jsx
import { useState } from 'react';
import Tooltip from '../components/Tooltip';
import { debounce } from '../utils/debounce';
import { announceToScreenReader } from '../utils/accessibility';

const EnhancedForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = debounce((value) => {
    if (!value.includes('@')) {
      setError('Invalid email address');
      announceToScreenReader('Invalid email address', 'assertive');
    } else {
      setError('');
    }
  }, 300);

  return (
    <div>
      <Tooltip content="We'll never share your email" position="right">
        <label htmlFor="email">Email Address</label>
      </Tooltip>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          validateEmail(e.target.value);
        }}
        aria-invalid={!!error}
        aria-describedby={error ? 'email-error' : undefined}
      />
      {error && (
        <p id="email-error" role="alert" className="text-red-600 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};
```

### Example 2: Lazy Loading with Skeleton

```jsx
import { useState, useEffect } from 'react';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const ArchitectureList = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  useEffect(() => {
    if (isVisible) {
      loadMoreItems();
    }
  }, [isVisible]);

  if (isLoading) {
    return <SkeletonLoader type="card" count={5} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        type="history"
        onAction={() => navigate('/generate')}
      />
    );
  }

  return (
    <div>
      {items.map(item => <Card key={item.id} data={item} />)}
      <div ref={ref}>Load more...</div>
    </div>
  );
};
```

### Example 3: Progress Tracking

```jsx
import { useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import { announceToScreenReader } from '../utils/accessibility';

const ArchitectureGenerator = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const generateArchitecture = async () => {
    const stages = [
      { progress: 20, status: 'Analyzing requirements...' },
      { progress: 40, status: 'Generating database schema...' },
      { progress: 60, status: 'Creating API endpoints...' },
      { progress: 80, status: 'Building diagrams...' },
      { progress: 100, status: 'Complete!' }
    ];

    for (const stage of stages) {
      setProgress(stage.progress);
      setStatus(stage.status);
      announceToScreenReader(stage.status, 'polite');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  return (
    <div>
      <ProgressBar
        progress={progress}
        label={status}
        color="blue"
        animated={true}
      />
      <button onClick={generateArchitecture}>Generate</button>
    </div>
  );
};
```

---

## 🎨 Styling Guidelines

### CSS Classes to Add to `index.css`:

```css
/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Focus visible */
*:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Shimmer animation for progress bars */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Fade in animation */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

/* Scale in animation */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out forwards;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## ✅ Implementation Checklist

### Phase 1: Core Components (Week 1)
- [ ] Add EmptyState to history pages
- [ ] Implement SkeletonLoader for all list views
- [ ] Add Tooltip to complex form fields
- [ ] Integrate ProgressBar in generation flow

### Phase 2: Hooks & Utils (Week 2)
- [ ] Add keyboard shortcuts (Ctrl+S, Escape, etc.)
- [ ] Implement useLocalStorage for user preferences
- [ ] Add useIntersectionObserver for lazy loading
- [ ] Integrate debounce for search inputs

### Phase 3: Accessibility (Week 3)
- [ ] Add ARIA labels to all interactive elements
- [ ] Implement focus trapping in modals
- [ ] Add screen reader announcements
- [ ] Test with keyboard navigation
- [ ] Verify color contrast ratios

### Phase 4: Polish (Week 4)
- [ ] Add loading states everywhere
- [ ] Improve error messages
- [ ] Add empty states
- [ ] Optimize animations
- [ ] Test on mobile devices

---

## 🐛 Common Issues & Solutions

### Issue: Tooltip not appearing
**Solution:** Ensure parent has `position: relative` or the tooltip has enough space.

### Issue: Skeleton loader flashing
**Solution:** Add minimum loading time:
```jsx
const [showSkeleton, setShowSkeleton] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => setShowSkeleton(false), 500);
  return () => clearTimeout(timer);
}, []);
```

### Issue: localStorage not syncing
**Solution:** Use the useLocalStorage hook which handles cross-tab sync automatically.

### Issue: Keyboard shortcuts conflicting
**Solution:** Use specific modifier keys (Ctrl, Alt) and check for input focus:
```jsx
useKeyboardShortcut('s', handleSave, { 
  ctrl: true,
  preventDefault: true 
});
```

---

## 📊 Performance Tips

1. **Lazy load heavy components:**
```jsx
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

2. **Debounce expensive operations:**
```jsx
const debouncedSearch = debounce(searchAPI, 300);
```

3. **Use Intersection Observer for animations:**
```jsx
const [ref, isVisible] = useIntersectionObserver({ freezeOnceVisible: true });
```

4. **Memoize callbacks:**
```jsx
const handleClick = useCallback(() => {
  // expensive operation
}, [dependencies]);
```

---

## 🎯 Next Steps

1. Integrate components into existing pages
2. Add keyboard shortcuts to main actions
3. Implement accessibility improvements
4. Add loading states throughout
5. Test with real users
6. Gather feedback and iterate

---

## 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Accessibility Docs](https://react.dev/learn/accessibility)
- [Inclusive Components](https://inclusive-components.design/)
- [Accessible Colors](https://accessible-colors.com/)

---

**Questions?** Check the component files for detailed JSDoc comments and prop documentation.
