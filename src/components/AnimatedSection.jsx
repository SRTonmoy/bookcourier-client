// components/AnimatedSection.jsx - FIXED EXPORTS
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  BookOpen, Truck, Shield, Clock, 
  Star, Users, Award, Heart 
} from 'lucide-react';

// Main AnimatedSection component
const AnimatedSection = ({ 
  children, 
  animation = 'fadeIn', 
  delay = 0, 
  duration = 0.5,
  threshold = 0.1,
  className = '',
  triggerOnce = true
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: triggerOnce, 
    amount: threshold 
  });
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      controls.start('visible');
      setHasAnimated(true);
    } else if (!isInView && !triggerOnce) {
      controls.start('hidden');
    }
  }, [isInView, controls, hasAnimated, triggerOnce]);

  const animations = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration, delay }
      }
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration, delay, ease: 'easeOut' }
      }
    },
    slideLeft: {
      hidden: { opacity: 0, x: -50 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration, delay, ease: 'easeOut' }
      }
    },
    slideRight: {
      hidden: { opacity: 0, x: 50 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration, delay, ease: 'easeOut' }
      }
    },
    scaleUp: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration, delay, ease: 'backOut' }
      }
    },
    bounce: {
      hidden: { opacity: 0, y: -50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration, 
          delay, 
          type: 'spring', 
          stiffness: 200 
        }
      }
    },
    staggerChildren: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          staggerChildren: 0.1,
          delayChildren: delay 
        }
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={animations[animation]}
      className={className}
    >
      {children}
    </motion.div>
  );
};


export const AnimatedCard = ({ 
  icon, 
  title, 
  description, 
  delay = 0,
  color = 'primary' 
}) => {
  const colors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info'
  };

  return (
    <AnimatedSection animation="scaleUp" delay={delay}>
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
        <div className="card-body items-center text-center">
          <div className={`w-16 h-16 rounded-full ${colors[color]}/20 flex items-center justify-center mb-4`}>
            {icon}
          </div>
          <h3 className="card-title text-lg mb-2">{title}</h3>
          <p className="text-base-content/70">{description}</p>
        </div>
      </div>
    </AnimatedSection>
  );
};

// AnimatedFeatureGrid component
export const AnimatedFeatureGrid = ({ items = [] }) => {
  return (
    <AnimatedSection animation="staggerChildren">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <AnimatedCard 
              icon={item.icon}
              title={item.title}
              description={item.description}
              delay={index * 0.1}
              color={item.color}
            />
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
};

// AnimatedCounter component
export const AnimatedCounter = ({ 
  end, 
  duration = 2, 
  label, 
  prefix = '', 
  suffix = '',
  delay = 0 
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isInView, end, duration, delay]);

  return (
    <AnimatedSection animation="scaleUp" delay={delay}>
      <div ref={ref} className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
          {prefix}{count.toLocaleString()}{suffix}
        </div>
        <div className="text-base-content/60 font-medium">{label}</div>
      </div>
    </AnimatedSection>
  );
};


export const AnimatedHeading = ({ 
  title, 
  subtitle, 
  centered = true,
  animation = 'slideUp',
  delay = 0 
}) => {
  return (
    <AnimatedSection animation={animation} delay={delay}>
      <div className={`${centered ? 'text-center' : ''} mb-10`}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        {subtitle && (
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </AnimatedSection>
  );
};


export const AnimatedButton = ({ 
  children, 
  href, 
  onClick, 
  variant = 'primary',
  size = 'md',
  icon,
  animation = 'bounce',
  delay = 0 
}) => {
  const buttonClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    outline: 'btn-outline',
    ghost: 'btn-ghost'
  };

  const sizeClass = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  return (
    <AnimatedSection animation={animation} delay={delay}>
      {href ? (
        <a 
          href={href} 
          className={`btn ${buttonClass[variant]} ${sizeClass[size]} gap-2`}
        >
          {icon}
          {children}
        </a>
      ) : (
        <button 
          onClick={onClick}
          className={`btn ${buttonClass[variant]} ${sizeClass[size]} gap-2`}
        >
          {icon}
          {children}
        </button>
      )}
    </AnimatedSection>
  );
};


export const defaultFeatures = [
  {
    icon: <Truck size={28} />,
    title: 'Fast Delivery',
    description: 'Quick fulfillment from local libraries within 24 hours',
    color: 'primary'
  },
  {
    icon: <BookOpen size={28} />,
    title: 'Wide Selection',
    description: 'Access to thousands of books from multiple libraries',
    color: 'secondary'
  },
  {
    icon: <Shield size={28} />,
    title: 'Secure Service',
    description: 'Your books are handled with care and tracked securely',
    color: 'success'
  },
  {
    icon: <Clock size={28} />,
    title: 'Flexible Returns',
    description: 'Schedule return pickups at your convenience',
    color: 'info'
  },
  {
    icon: <Star size={28} />,
    title: 'Premium Quality',
    description: 'All books are quality checked before delivery',
    color: 'warning'
  },
  {
    icon: <Users size={28} />,
    title: 'Community Driven',
    description: 'Supporting local libraries and readers',
    color: 'accent'
  },
  {
    icon: <Award size={28} />,
    title: 'Award Winning',
    description: 'Recognized for innovation in library services',
    color: 'primary'
  },
  {
    icon: <Heart size={28} />,
    title: 'Passionate Team',
    description: 'Book lovers dedicated to serving readers',
    color: 'secondary'
  }
];


export default AnimatedSection;