import React from 'react';
import ContentSection from '@/components/ContentSection';
import ContentDisplay from '@/components/ContentDisplay';

export default function DayPage({ content }) {
  return (
    <ContentSection
      title={content.attackType}
      subtitle={`Security analysis for ${new Date(content.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
    >
      <div className="max-w-7xl mx-auto">
        <ContentDisplay content={content} />
      </div>
    </ContentSection>
  );
} 