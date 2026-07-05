import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gamepad2, Play, Star, Zap } from "lucide-react";
import { useState } from "react";

/**
 * Game Portal - Bold Gradient Maximalism Design
 * Hero section with asymmetric layout, game grid, and interactive game cards
 * Theme: Vibrant purple-to-blue gradients with cyan accents
 */

interface Game {
  id: number;
  title: string;
  description: string;
  image: string;
  badge?: string;
  rating: number;
}

const games: Game[] = [
  {
    id: 1,
    title: "Neon Runner",
    description: "High-speed arcade action with neon aesthetics",
    image: "/manus-storage/game-card-1_2e28e5f2.png",
    badge: "New",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Puzzle Zen",
    description: "Relaxing puzzle game with beautiful visuals",
    image: "/manus-storage/game-card-2_5dcef065.png",
    badge: "Popular",
    rating: 4.6,
  },
  {
    id: 3,
    title: "Speed Racer",
    description: "Futuristic racing with dynamic tracks",
    image: "/manus-storage/game-card-3_375287a0.png",
    rating: 4.7,
  },
];

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameWindow, setGameWindow] = useState<Window | null>(null);

  const openGameWindow = (game: Game) => {
    // Create a new window with the game
    const gameHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${game.title} - Nexus Games</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Inter', system-ui, sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: #f8fafc;
          }
          .game-container {
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          }
          .game-header {
            padding: 20px;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(124, 58, 237, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .game-title {
            font-size: 24px;
            font-weight: 700;
            font-family: 'Sora', system-ui, sans-serif;
            background: linear-gradient(135deg, #7C3AED, #06B6D4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .close-btn {
            background: linear-gradient(135deg, #7C3AED, #3B82F6);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          .close-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
          }
          .game-canvas {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow: hidden;
          }
          canvas {
            border: 2px solid rgba(124, 58, 237, 0.3);
            border-radius: 12px;
            box-shadow: 0 0 40px rgba(124, 58, 237, 0.2), 0 0 80px rgba(6, 182, 212, 0.1);
          }
          .game-info {
            padding: 20px;
            background: rgba(0, 0, 0, 0.2);
            border-top: 1px solid rgba(124, 58, 237, 0.2);
            text-align: center;
            font-size: 14px;
            color: #cbd5e1;
          }
        </style>
      </head>
      <body>
        <div class="game-container">
          <div class="game-header">
            <div class="game-title">${game.title}</div>
            <button class="close-btn" onclick="window.close()">Close Game</button>
          </div>
          <div class="game-canvas">
            <canvas id="gameCanvas"></canvas>
          </div>
          <div class="game-info">
            Use Arrow Keys or WASD to move • Space to jump/action
          </div>
        </div>
        <script>
          // Snake Game Implementation
          const canvas = document.getElementById('gameCanvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas size
          canvas.width = 600;
          canvas.height = 400;
          
          // Game variables
          const gridSize = 20;
          let snake = [{x: 10, y: 10}];
          let food = {x: 15, y: 15};
          let direction = {x: 1, y: 0};
          let nextDirection = {x: 1, y: 0};
          let score = 0;
          let gameRunning = true;
          
          // Keyboard controls
          document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
              case 'arrowup':
              case 'w':
                if(direction.y === 0) nextDirection = {x: 0, y: -1};
                break;
              case 'arrowdown':
              case 's':
                if(direction.y === 0) nextDirection = {x: 0, y: 1};
                break;
              case 'arrowleft':
              case 'a':
                if(direction.x === 0) nextDirection = {x: -1, y: 0};
                break;
              case 'arrowright':
              case 'd':
                if(direction.x === 0) nextDirection = {x: 1, y: 0};
                break;
            }
          });
          
          function drawRect(x, y, size, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * gridSize, y * gridSize, size * gridSize, size * gridSize);
          }
          
          function drawGame() {
            // Clear canvas
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw grid
            ctx.strokeStyle = 'rgba(124, 58, 237, 0.1)';
            ctx.lineWidth = 1;
            for(let i = 0; i <= canvas.width; i += gridSize) {
              ctx.beginPath();
              ctx.moveTo(i, 0);
              ctx.lineTo(i, canvas.height);
              ctx.stroke();
            }
            for(let i = 0; i <= canvas.height; i += gridSize) {
              ctx.beginPath();
              ctx.moveTo(0, i);
              ctx.lineTo(canvas.width, i);
              ctx.stroke();
            }
            
            // Draw snake
            snake.forEach((segment, index) => {
              if(index === 0) {
                // Head with gradient
                const gradient = ctx.createLinearGradient(segment.x * gridSize, segment.y * gridSize, (segment.x + 1) * gridSize, (segment.y + 1) * gridSize);
                gradient.addColorStop(0, '#7C3AED');
                gradient.addColorStop(1, '#06B6D4');
                ctx.fillStyle = gradient;
              } else {
                ctx.fillStyle = '#8B5CF6';
              }
              drawRect(segment.x, segment.y, 1, ctx.fillStyle);
            });
            
            // Draw food
            ctx.fillStyle = '#FBCFE8';
            ctx.beginPath();
            ctx.arc((food.x + 0.5) * gridSize, (food.y + 0.5) * gridSize, gridSize / 2 - 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw score
            ctx.fillStyle = '#06B6D4';
            ctx.font = 'bold 20px Sora';
            ctx.fillText('Score: ' + score, 10, 25);
          }
          
          function update() {
            if(!gameRunning) return;
            
            direction = nextDirection;
            
            // Move snake
            const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
            
            // Check collisions
            if(head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
              gameRunning = false;
              alert('Game Over! Final Score: ' + score);
              return;
            }
            
            for(let segment of snake) {
              if(head.x === segment.x && head.y === segment.y) {
                gameRunning = false;
                alert('Game Over! Final Score: ' + score);
                return;
              }
            }
            
            snake.unshift(head);
            
            // Check food collision
            if(head.x === food.x && head.y === food.y) {
              score += 10;
              food = {x: Math.floor(Math.random() * (canvas.width / gridSize)), y: Math.floor(Math.random() * (canvas.height / gridSize))};
            } else {
              snake.pop();
            }
          }
          
          function gameLoop() {
            update();
            drawGame();
            setTimeout(gameLoop, 100);
          }
          
          gameLoop();
        </script>
      </body>
      </html>
    `;
    
    const blob = new Blob([gameHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, 'game', 'width=800,height=600');
    setGameWindow(newWindow);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/portal-logo_76c2ca80.png" alt="Nexus Games" className="w-8 h-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Nexus Games
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-slate-600 hover:text-purple-600 transition">Games</a>
            <a href="#" className="text-slate-600 hover:text-purple-600 transition">Leaderboard</a>
            <a href="#" className="text-slate-600 hover:text-purple-600 transition">Community</a>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/50 text-white">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(/manus-storage/hero-background_58f36684.png)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />

        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900">
                  Level Up Your <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">Game</span>
                </h1>
                <p className="text-xl text-slate-600">
                  Where casual meets competitive. Discover endless gaming joy with our curated collection of premium games.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transform hover:scale-105 transition-all"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Playing
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Browse Games
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <p className="text-sm text-slate-600">Games Available</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-cyan-500">2M+</div>
                  <p className="text-sm text-slate-600">Active Players</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-600">4.8★</div>
                  <p className="text-sm text-slate-600">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Right Floating Card */}
            <div className="relative h-96 md:h-full">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-purple-300 to-cyan-300 rounded-full opacity-20 blur-3xl" />
              <Card className="relative bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-purple-200 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-500/10" />
                <img
                  src="/manus-storage/game-card-1_2e28e5f2.png"
                  alt="Featured Game"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Neon Runner</h3>
                  <p className="text-sm opacity-90 mb-4">High-speed arcade action</p>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:shadow-lg"
                    onClick={() => openGameWindow(games[0])}
                  >
                    Play Now
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600" />

      {/* Featured Games Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Featured Games
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Handpicked titles that deliver unforgettable gaming experiences
            </p>
          </div>

          {/* Game Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {games.map((game) => (
              <Card
                key={game.id}
                className="group relative overflow-hidden border-2 border-slate-200 hover:border-purple-400 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-purple-500/20"
                onClick={() => setSelectedGame(game)}
              >
                {/* Badge */}
                {game.badge && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {game.badge}
                    </span>
                  </div>
                )}

                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{game.title}</h3>
                    <p className="text-sm text-slate-600">{game.description}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(game.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{game.rating}</span>
                  </div>

                  {/* Play Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transform hover:scale-105 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      openGameWindow(game);
                    }}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Play Game
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container max-w-4xl mx-auto px-4 relative z-10 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Play?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join millions of players worldwide and discover your next favorite game today.
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-slate-100 font-bold text-lg px-8"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/manus-storage/portal-logo_76c2ca80.png" alt="Nexus Games" className="w-6 h-6" />
                <span className="font-bold text-white">Nexus Games</span>
              </div>
              <p className="text-sm">Your portal to endless gaming joy.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Games</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Browse All</a></li>
                <li><a href="#" className="hover:text-white transition">New Releases</a></li>
                <li><a href="#" className="hover:text-white transition">Popular</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Leaderboard</a></li>
                <li><a href="#" className="hover:text-white transition">Forums</a></li>
                <li><a href="#" className="hover:text-white transition">Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2024 Nexus Games. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Game Detail Modal */}
      <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
        <DialogContent className="max-w-2xl">
          {selectedGame && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  {selectedGame.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <img
                  src={selectedGame.image}
                  alt={selectedGame.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="space-y-4">
                  <p className="text-slate-600">{selectedGame.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(selectedGame.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-slate-700">{selectedGame.rating}</span>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/50 text-white h-12 text-lg"
                    onClick={() => {
                      openGameWindow(selectedGame);
                      setSelectedGame(null);
                    }}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Play Now in New Window
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
