
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Stars, Sun, Moon } from "lucide-react";

const ExampleReading = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            <Quote className="h-8 w-8 text-yellow-400" />
            What to Expect
          </h3>
          <p className="text-xl text-purple-200">
            Here's a complete example of the in-depth, personalized readings you'll receive
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Personal Horoscope Section */}
          <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-400/30 backdrop-blur-md">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center border-b border-indigo-400/30 pb-6">
                  <h4 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                    <Stars className="h-6 w-6 text-yellow-400" />
                    Personal Horoscope Reading
                  </h4>
                  <p className="text-indigo-200">For Jamie Stas - Born April 16, 1980, Genk, Belgium</p>
                  <p className="text-sm text-indigo-300 mt-2">Aries Sun • Dynamic Fire Energy • Mars Ruled</p>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <div className="text-indigo-100 leading-relaxed space-y-6 text-sm">
                    <div className="bg-gradient-to-r from-indigo-800/30 to-purple-800/30 rounded-lg p-4">
                      <p className="italic text-indigo-200 mb-4">
                        "Welcome, Jamie Stas, to Your Personal Reading. I'm delighted to have this opportunity to explore the deeper layers of your being and the path ahead. Born on April 16, 1980, in the serene town of Genk, Belgium, your birth chart serves as a celestial map that holds keys to your life's journey."
                      </p>
                    </div>
                    
                    <div className="bg-indigo-800/20 rounded-lg p-6 space-y-4">
                      <h5 className="text-white font-semibold text-base flex items-center gap-2">
                        <Sun className="h-5 w-5 text-orange-400" />
                        Personal Situation Insight
                      </h5>
                      <p className="text-indigo-200">
                        "Jamie, as an Aries born with the rising sun, your chart is infused with the dynamic energy of new beginnings and untapped potential. Aries, ruled by Mars, is a fire sign characterized by courage, enthusiasm, and a pioneering spirit. This provides you with a natural drive to initiate change and lead others with vibrancy and confidence."
                      </p>
                      <p className="text-indigo-200">
                        "Currently, you may be feeling the gravitational pull of life's many responsibilities and expectations. Your hidden strength lies in your ability to adapt and forge new paths, even when circumstances seem daunting. The influence of your birth chart suggests a theme of self-discovery and transformation."
                      </p>
                    </div>
                    
                    <div className="bg-indigo-800/20 rounded-lg p-6 space-y-4">
                      <h5 className="text-white font-semibold text-base flex items-center gap-2">
                        <Moon className="h-5 w-5 text-blue-300" />
                        Short-term Outlook (Next 3 Months)
                      </h5>
                      <p className="text-indigo-200">
                        "For the next three months, the stars are aligning to offer you opportunities both in personal and professional realms. This period is ripe with possibility, but the key will be in how you harness your innate Aries initiative. In your personal life, this is a splendid time to nurture relationships by introducing new activities that allow for mutual growth."
                      </p>
                      <p className="text-indigo-200">
                        "Professionally, avenues for advancement or new projects may present themselves, so be open to stepping out of your comfort zone. Be mindful of potential obstacles, particularly those arising from impatience or impulsive decisions. Use this time to practice thoughtful consideration before making commitments."
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-indigo-700/40 to-purple-700/40 rounded-lg p-6 space-y-4">
                      <h5 className="text-white font-semibold text-base">Actionable Ritual & Daily Mantra</h5>
                      <div className="space-y-3">
                        <p className="text-indigo-200">
                          <strong>Elemental Balance Ritual:</strong> Light a red candle, gather a bowl of water, feather, and small stone. Hold each element while affirming: "Earth, ground my energy. Air, clear my mind. Water, bring peace."
                        </p>
                        <div className="bg-indigo-900/30 rounded-lg p-4">
                          <p className="text-indigo-200 italic font-medium">
                            "Daily Mantra: I harness my passion with wisdom and grace, manifesting my path with courage and space."
                          </p>
                        </div>
                        <p className="text-indigo-200">
                          <strong>Best Days This Month:</strong> April 8th (New Moon energy), April 15th (Venus alignment), April 23rd (Mercury harmony)
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-800/30 to-indigo-800/30 rounded-lg p-4">
                      <p className="text-indigo-200 text-sm">
                        <strong>Motivational Closing:</strong> "Remember, Jamie, you are the architect of your destiny. The universe has gifted you with the tools and talents to manifest a life brimming with excitement and fulfillment. Trust in your journey and embrace every moment with curiosity and courage."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tarot Reading Section */}
          <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30 backdrop-blur-md">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center border-b border-purple-400/30 pb-6">
                  <h4 className="text-2xl font-bold text-white mb-2">Tarot Reading: Work & Career</h4>
                  <p className="text-purple-200">For Jamie - Aries Sun, Taurus Rising</p>
                  <p className="text-sm text-purple-300 mt-2">Question: "What should I focus on in my career this month?"</p>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <div className="text-purple-100 leading-relaxed space-y-6 text-sm">
                    <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-lg p-4">
                      <p className="italic text-purple-200 mb-4">
                        "Hello Jamie, Welcome to your personalized tarot reading. It's a pleasure to connect with you today and explore the theme of work and career as you navigate the path that aligns with your professional aspirations and personal growth."
                      </p>
                      <p className="italic text-purple-200">
                        "As an Aries Sun with Taurus Rising, you bring a unique combination of pioneering spirit and steady determination to your professional life. Your Aries energy drives you to initiate and lead, while your Taurus Rising provides the persistence and practical approach needed to see projects through to completion."
                      </p>
                    </div>
                    
                    <div className="bg-purple-800/20 rounded-lg p-6 space-y-4">
                      <h5 className="text-white font-semibold text-base">Card 1: The Present Situation - The Eight of Pentacles</h5>
                      <p className="text-purple-200">
                        "The Eight of Pentacles appears in your present situation, indicating that you are currently in a phase of dedicated learning and skill development. This card shows a craftsperson meticulously working on their trade, suggesting that you are diligently applying yourself to mastering your craft or learning something new that will enhance your professional capabilities."
                      </p>
                      <p className="text-purple-200">
                        "Your Aries Sun's natural enthusiasm for new challenges is perfectly aligned with this energy. You're not just going through the motions - you're genuinely passionate about improving and growing. This card encourages you to continue this focused approach, as your efforts are building a solid foundation for future success."
                      </p>
                    </div>
                    
                    <div className="bg-purple-800/20 rounded-lg p-6 space-y-4">
                      <h5 className="text-white font-semibold text-base">Card 2: The Challenge - The Five of Wands</h5>
                      <p className="text-purple-200">
                        "The Five of Wands represents the primary challenge you're facing in your career this month. This card depicts five figures holding wands in what appears to be a chaotic struggle, symbolizing competition, conflicting ideas, or workplace tensions. You may find yourself in situations where different viewpoints clash."
                      </p>
                      <p className="text-purple-200">
                        "However, this challenge serves as an invitation to harness your natural Aries leadership qualities. Rather than being overwhelmed by the conflict, you can step up as a mediator or leader who brings clarity to confusion. Your Taurus Rising gives you the stability to remain grounded during turbulent times."
                      </p>
                    </div>
                    
                    <div className="bg-purple-800/20 rounded-lg p-6 space-y-4">
                      <h5 className="text-white font-semibold text-base">Card 3: The Outcome - The Star</h5>
                      <p className="text-purple-200">
                        "The Star is a beautiful card to appear as your outcome, suggesting that once you navigate through the current challenges, you will find renewed purpose, inspiration, and hope in your career path. This card represents healing, guidance, and divine inspiration - indicating that your professional journey is aligned with your higher purpose."
                      </p>
                      <p className="text-purple-200">
                        "The Star suggests that your hard work and dedication combined with your ability to handle workplace challenges will lead to a period of clarity and inspiration. You may receive recognition for your efforts, find new opportunities that truly excite you, or discover a renewed sense of purpose in your current role."
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-700/40 to-pink-700/40 rounded-lg p-6 space-y-4">
                      <h5 className="text-white font-semibold text-base">Summary & Practical Advice</h5>
                      <p className="text-purple-200">
                        "This month, your focus should be on continuing your dedicated approach to skill development while positioning yourself as a unifying force in any workplace conflicts that arise. Your combination of Aries initiative and Taurus steadiness makes you uniquely qualified to both innovate and stabilize."
                      </p>
                      <div className="space-y-2 mt-4">
                        <p className="text-purple-200"><strong>Practical Actions:</strong></p>
                        <ul className="list-disc list-inside text-purple-200 space-y-1 ml-4">
                          <li>Continue investing time in learning new skills or perfecting existing ones</li>
                          <li>When conflicts arise, step up as a mediator rather than choosing sides</li>
                          <li>Document your achievements and contributions this month</li>
                          <li>Stay open to unexpected opportunities that may present themselves</li>
                          <li>Trust your instincts when making career-related decisions</li>
                        </ul>
                      </div>
                      <div className="bg-purple-900/30 rounded-lg p-4 mt-4">
                        <p className="text-purple-200 italic">
                          "Affirmation to carry with you: 'I am committed to my growth, skilled in navigation challenges, and open to the inspiration that guides my career path. My dedication today creates the success of tomorrow.'"
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-indigo-800/30 to-purple-800/30 rounded-lg p-4">
                      <p className="text-purple-200 text-sm">
                        <strong>Personal Note:</strong> Remember, Jamie, your Aries Sun gives you the courage to take bold steps, while your Taurus Rising ensures you build lasting, sustainable success. Trust in this powerful combination as you navigate your professional journey this month.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center pt-8 mt-8 border-t border-purple-400/30">
          <p className="text-purple-200 font-medium text-lg mb-2">
            Your Complete Double Reading Package Includes:
          </p>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto text-purple-300 text-sm">
            <div>
              <h6 className="text-white font-semibold mb-2">✨ Personal Horoscope</h6>
              <ul className="space-y-1 text-left">
                <li>• Birth chart insights & personality analysis</li>
                <li>• 3-month outlook for love, career & finances</li>
                <li>• Personalized rituals & daily mantras</li>
                <li>• Lucky dates & cosmic timing guidance</li>
              </ul>
            </div>
            <div>
              <h6 className="text-white font-semibold mb-2">🔮 Tarot Reading</h6>
              <ul className="space-y-1 text-left">
                <li>• 3-card spread with detailed interpretations</li>
                <li>• Practical advice & actionable steps</li>
                <li>• Astrological correlations to your profile</li>
                <li>• Personal affirmations & guidance</li>
              </ul>
            </div>
          </div>
          <p className="text-purple-300 text-sm mt-6">
            Combined Length: ~1500-2000 words • Reading time: 8-12 minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExampleReading;
