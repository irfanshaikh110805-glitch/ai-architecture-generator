#!/usr/bin/env python3
"""
Test script to verify architecture generation produces UNIQUE results for different domains
"""
import asyncio
import json
from ai_service import generate_architecture
from datetime import datetime

TEST_CASES = [
    {
        "name": "Telemedicine Platform",
        "idea": "A telemedicine platform for remote patient monitoring with wearable device integration, real-time vital signs tracking, AI-powered health alerts, video consultations, and electronic health records management",
        "expected_keywords": ["real-time", "wearable", "health", "video", "FHIR", "HL7", "HIPAA"]
    },
    {
        "name": "E-Learning Platform",
        "idea": "An online learning platform with live video classes, interactive quizzes, progress tracking, AI-powered personalized learning paths, and peer collaboration features",
        "expected_keywords": ["video streaming", "quiz", "progress", "learning", "CDN", "WebRTC"]
    },
    {
        "name": "E-Commerce Marketplace",
        "idea": "A marketplace for handmade goods with seller analytics, integrated payments, AI-powered product recommendations, inventory management, and order tracking",
        "expected_keywords": ["inventory", "payment", "recommendation", "order", "search", "cart"]
    },
    {
        "name": "Real-Time Collaboration",
        "idea": "A collaborative whiteboard application with real-time drawing, video chat, version history, and multi-user presence indicators",
        "expected_keywords": ["WebSocket", "real-time", "collaboration", "presence", "event", "sync"]
    },
    {
        "name": "IoT Dashboard",
        "idea": "An IoT dashboard for smart home devices with real-time sensor data visualization, automated rules engine, predictive maintenance alerts, and energy consumption analytics",
        "expected_keywords": ["IoT", "sensor", "time-series", "MQTT", "analytics", "real-time"]
    }
]

async def test_domain(test_case):
    """Test a single domain and return results"""
    print(f"\n{'='*80}")
    print(f"Testing: {test_case['name']}")
    print(f"{'='*80}")
    print(f"Idea: {test_case['idea'][:100]}...")
    
    result = await generate_architecture(test_case['idea'])
    result_dict = result.model_dump()
    
    # Check if it's a fallback
    if result_dict.get('_fallback'):
        print("⚠️  Using fallback response (API quota exceeded)")
        return None
    
    # Analyze the result
    analysis = {
        "name": test_case['name'],
        "architecture_type": result_dict['architecture']['type'],
        "num_features": len(result_dict['features']),
        "num_apis": len(result_dict['apis']),
        "num_tables": len(result_dict['database']),
        "num_components": len(result_dict['architecture']['components']),
        "tech_stack": result_dict['architecture']['tech_stack'],
        "features": [f['name'] for f in result_dict['features'][:5]],
        "components": result_dict['architecture']['components'][:5],
        "found_keywords": []
    }
    
    # Check for expected keywords in the full result
    result_str = json.dumps(result_dict).lower()
    for keyword in test_case['expected_keywords']:
        if keyword.lower() in result_str:
            analysis['found_keywords'].append(keyword)
    
    # Print summary
    print(f"\n✅ Architecture Type: {analysis['architecture_type']}")
    print(f"📊 Stats: {analysis['num_features']} features, {analysis['num_apis']} APIs, {analysis['num_tables']} tables")
    print(f"\n🎯 Top Features:")
    for feature in analysis['features']:
        print(f"   • {feature}")
    print(f"\n🏗️  Key Components:")
    for component in analysis['components']:
        print(f"   • {component}")
    print(f"\n🔍 Domain Keywords Found: {', '.join(analysis['found_keywords'])}")
    
    return analysis

async def main():
    print("="*80)
    print("DOMAIN-SPECIFIC ARCHITECTURE GENERATION TEST")
    print("="*80)
    print(f"Testing {len(TEST_CASES)} different domains to verify uniqueness")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = []
    for test_case in TEST_CASES:
        result = await test_domain(test_case)
        if result:
            results.append(result)
        await asyncio.sleep(2)  # Small delay between requests
    
    # Summary comparison
    if len(results) > 1:
        print(f"\n{'='*80}")
        print("UNIQUENESS ANALYSIS")
        print(f"{'='*80}")
        
        # Compare architecture types
        arch_types = [r['architecture_type'] for r in results]
        print(f"\n📐 Architecture Types:")
        for r in results:
            print(f"   {r['name']}: {r['architecture_type']}")
        
        if len(set(arch_types)) == 1:
            print("   ⚠️  WARNING: All architectures have the same type!")
        else:
            print(f"   ✅ {len(set(arch_types))} different architecture types used")
        
        # Compare tech stacks
        print(f"\n💻 Tech Stack Diversity:")
        backends = [r['tech_stack']['backend'] for r in results]
        databases = [r['tech_stack']['database'] for r in results]
        print(f"   Backend technologies: {len(set(backends))} unique")
        print(f"   Database technologies: {len(set(databases))} unique")
        
        # Compare components
        print(f"\n🏗️  Component Diversity:")
        all_components = []
        for r in results:
            all_components.extend(r['components'])
        unique_components = len(set(all_components))
        total_components = len(all_components)
        print(f"   {unique_components} unique components out of {total_components} total")
        print(f"   Uniqueness ratio: {unique_components/total_components*100:.1f}%")
        
        if unique_components / total_components > 0.7:
            print("   ✅ High component diversity - architectures are unique!")
        else:
            print("   ⚠️  Low component diversity - architectures may be too similar")
        
        # Save detailed results
        with open('domain_test_results.json', 'w') as f:
            json.dump(results, f, indent=2)
        print(f"\n📄 Detailed results saved to domain_test_results.json")
    
    elif len(results) == 0:
        print("\n⚠️  No results generated - API quota exceeded")
        print("Please wait for quota reset or upgrade to paid tier")
        print("The improved prompt is ready and will work once API is available")
    
    print(f"\n{'='*80}")
    print(f"Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*80}")

if __name__ == "__main__":
    asyncio.run(main())
