import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ClaudeClient } from '@/lib/claude';

export async function POST(request: NextRequest) {
  const { jdText, userId } = await request.json();

  if (!jdText) {
    return NextResponse.json(
      { error: 'Job description is required' },
      { status: 400 }
    );
  }

  try {
    // Get user profile for context
    let userProfile = null;
    if (userId) {
      const { data } = await supabase
        .from('user_profiles')
        .select('technicalSkills, crmExperience, apis, dataAnalysis')
        .eq('id', userId)
        .single();
      userProfile = data;
    }

    // Prepare Claude prompt
    const prompt = `Analyze this Job Description as a GTM Engineer. Return JSON with:\n- jobTitle: extracted from JD\n- companyName: extracted from JD\n- matchPercentage: 0-100 based on user's profile\n- coreTechnicalSkills: array of skills mentioned\n- gtmAlignment: object with crmScore, apiScore, automationScore (0-30 each)\n- missingSkills: skills user lacks\n- suggestedBulletPoints: 3-5 resume bullet points tailored to the JD\n\nJob Description:\n${jdText}\n\nUser Profile Context:\n${JSON.stringify(userProfile, null, 2)}`;

    // Call Claude
    const analysis = await ClaudeClient.prompt(prompt, {
      model: 'claude-sonnet-5',
      max_tokens: 1500,
    });

    try {
      const parsed = JSON.parse(analysis);
      return NextResponse.json({ success: true, data: parsed });
    } catch (parseError) {
      // If JSON parsing fails, return raw text
      return NextResponse.json({ success: true, data: { rawAnalysis: analysis } });
    }
  } catch (error) {
      console.error('JD processing error:', error);
      return NextResponse.json(
      { error: 'Failed to process JD' },
      { status: 500 }
    );
  }
}
