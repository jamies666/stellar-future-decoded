
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

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
        
        <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30 backdrop-blur-md">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center border-b border-purple-400/30 pb-6">
                <h4 className="text-2xl font-bold text-white mb-2">Complete Reading: Work & Career</h4>
                <p className="text-purple-200">For Jamie - Aries Sun, Taurus Rising</p>
                <p className="text-sm text-purple-300 mt-2">Question: "What should I focus on in my career this month?"</p>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <div className="text-purple-100 leading-relaxed space-y-6 text-sm">
                  <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-lg p-4">
                    <p className="italic text-purple-200 mb-4">
                      "Hello Jamie, Welcome to your personalized tarot reading. It's a pleasure to connect with you today and explore the theme of work and career as you navigate the path that aligns with your professional aspirations and personal growth.
                    </p>
                    <p className="italic text-purple-200">
                      As an Aries Sun with Taurus Rising, you bring a unique combination of pioneering spirit and steady determination to your professional life. Your Aries energy drives you to initiate and lead, while your Taurus Rising provides the persistence and practical approach needed to see projects through to completion. Let's see what the cards reveal about your career focus this month."
                    </p>
                  </div>
                  
                  <div className="bg-purple-800/20 rounded-lg p-6 space-y-4">
                    <h5 className="text-white font-semibold text-base">Card 1: The Present Situation - The Eight of Pentacles</h5>
                    <p className="text-purple-200">
                      "The Eight of Pentacles appears in your present situation, indicating that you are currently in a phase of dedicated learning and skill development. This card shows a craftsperson meticulously working on their trade, suggesting that you are diligently applying yourself to mastering your craft or learning something new that will enhance your professional capabilities.
                    </p>
                    <p className="text-purple-200">
                      Your Aries Sun's natural enthusiasm for new challenges is perfectly aligned with this energy. You're not just going through the motions - you're genuinely passionate about improving and growing. This card encourages you to continue this focused approach, as your efforts are building a solid foundation for future success. The meticulous attention to detail reflected in this card also resonates with your Taurus Rising, which appreciates thorough, quality work."
                    </p>
                  </div>
                  
                  <div className="bg-purple-800/20 rounded-lg p-6 space-y-4">
                    <h5 className="text-white font-semibold text-base">Card 2: The Challenge - The Five of Wands</h5>
                    <p className="text-purple-200">
                      "The Five of Wands represents the primary challenge you're facing in your career this month. This card depicts five figures holding wands in what appears to be a chaotic struggle, symbolizing competition, conflicting ideas, or workplace tensions. You may find yourself in situations where different viewpoints clash, or you might be dealing with increased competition in your field.
                    </p>
                    <p className="text-purple-200">
                      However, this challenge serves as an invitation to harness your natural Aries leadership qualities. Rather than being overwhelmed by the conflict, you can step up as a mediator or leader who brings clarity to confusion. Your Taurus Rising gives you the stability to remain grounded during turbulent times. Use this period to demonstrate your ability to navigate complex interpersonal dynamics and emerge as someone who can unite rather than divide."
                    </p>
                  </div>
                  
                  <div className="bg-purple-800/20 rounded-lg p-6 space-y-4">
                    <h5 className="text-white font-semibold text-base">Card 3: The Outcome - The Star</h5>
                    <p className="text-purple-200">
                      "The Star is a beautiful card to appear as your outcome, suggesting that once you navigate through the current challenges, you will find renewed purpose, inspiration, and hope in your career path. This card represents healing, guidance, and divine inspiration - indicating that your professional journey is aligned with your higher purpose.
                    </p>
                    <p className="text-purple-200">
                      The Star suggests that your hard work and dedication (Eight of Pentacles) combined with your ability to handle workplace challenges (Five of Wands) will lead to a period of clarity and inspiration. You may receive recognition for your efforts, find new opportunities that truly excite you, or discover a renewed sense of purpose in your current role. This card encourages you to trust in your journey and remain open to the guidance that will come your way."
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-700/40 to-pink-700/40 rounded-lg p-6 space-y-4">
                    <h5 className="text-white font-semibold text-base">Summary & Practical Advice</h5>
                    <p className="text-purple-200">
                      "This month, your focus should be on continuing your dedicated approach to skill development while positioning yourself as a unifying force in any workplace conflicts that arise. Your combination of Aries initiative and Taurus steadiness makes you uniquely qualified to both innovate and stabilize.
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
              
              <div className="text-center pt-6 border-t border-purple-400/30">
                <p className="text-purple-200 font-medium">
                  Each reading includes detailed card interpretations, practical advice, personalized guidance based on your astrological profile, and actionable steps you can take immediately.
                </p>
                <p className="text-purple-300 text-sm mt-2">
                  Length: ~800-1200 words • Reading time: 4-6 minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ExampleReading;
