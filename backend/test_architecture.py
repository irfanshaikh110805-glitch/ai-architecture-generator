#!/usr/bin/env python3
"""
Quick test script to verify the improved architecture generation
"""
import asyncio
import json
from ai_service import generate_architecture

async def test_architecture():
    # Test with a specific domain project
    test_idea = "A telemedicine platform for remote patient monitoring with wearable device integration, real-time vital signs tracking, AI-powered health alerts, video consultations, and electronic health records management"
    
    print("Testing architecture generation...")
    print(f"Project Idea: {test_idea}\n")
    
    result = await generate_architecture(test_idea)
    
    print("=" * 80)
    print("GENERATED ARCHITECTURE")
    print("=" * 80)
    
    # Convert to dict for pretty printing
    result_dict = result.model_dump()
    
    print("\n📋 FEATURES:")
    for feature in result_dict['features'][:5]:  # Show first 5
        print(f"  • {feature['name']} ({feature['priority']})")
    print(f"  ... and {len(result_dict['features']) - 5} more")
    
    print("\n🗄️  DATABASE TABLES:")
    for table in result_dict['database']:
        print(f"  • {table['table']}: {len(table['fields'])} fields")
    
    print("\n🔌 API ENDPOINTS:")
    for api in result_dict['apis'][:5]:  # Show first 5
        print(f"  • {api['method']} {api['endpoint']}")
    print(f"  ... and {len(result_dict['apis']) - 5} more")
    
    print("\n🏗️  ARCHITECTURE:")
    print(f"  Type: {result_dict['architecture']['type']}")
    print(f"  Components: {len(result_dict['architecture']['components'])}")
    for comp in result_dict['architecture']['components'][:3]:
        print(f"    - {comp}")
    
    print("\n💻 TECH STACK:")
    print(f"  Frontend: {result_dict['architecture']['tech_stack']['frontend']}")
    print(f"  Backend: {result_dict['architecture']['tech_stack']['backend']}")
    print(f"  Database: {result_dict['architecture']['tech_stack']['database']}")
    
    print("\n💰 ESTIMATION:")
    print(f"  Hours: {result_dict['estimation']['hours']}")
    print(f"  Team: {result_dict['estimation']['team_size']}")
    print(f"  Cost: {result_dict['estimation']['cost']}")
    
    if result_dict.get('_fallback'):
        print("\n⚠️  WARNING: Using fallback response (API quota or error)")
    else:
        print("\n✅ Successfully generated custom architecture!")
    
    print("\n" + "=" * 80)
    
    # Save full result to file
    with open('test_result.json', 'w') as f:
        json.dump(result_dict, f, indent=2)
    print("Full result saved to test_result.json")

if __name__ == "__main__":
    asyncio.run(test_architecture())
