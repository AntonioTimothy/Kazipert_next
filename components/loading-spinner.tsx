"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingSpinner() {
  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="flex flex-col items-center justify-center space-y-4"
        >
          {/* Animated SVG logo */}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <Image
                src="/animated-logo.svg"
                alt="Kazipert Loading"
                width={120}
                height={120}
                priority
                className="drop-shadow-md"
              />
            </motion.div>
          </div>

          {/* Loading text with progress indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col items-center space-y-2"
          >
            <p className="text-sm font-medium text-muted-foreground tracking-wide">
              Loading Kazipert...
            </p>
            {/* Progress bar */}
            <motion.div 
              className="h-1 w-24 bg-muted rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}