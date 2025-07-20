"""
Market Research Service using Serper API and Gemini AI
"""
import asyncio
import json
from typing import Dict, List, Optional
import aiohttp
import google.generativeai as genai
from config import settings

class MarketResearchService:
    def __init__(self):
        self.serper_api_key = settings.serper_api_key
        self.gemini_api_key = settings.gemini_api_key

        genai.configure(api_key=self.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        
        self.serper_base_url = "https://google.serper.dev"
    
    async def search_market_data(self, query: str, location: str = "us") -> Dict:
        """
        Search for market data using Serper API
        """
        headers = {
            'X-API-KEY': self.serper_api_key,
            'Content-Type': 'application/json',
        }
        
        payload = {
            'q': query,
            'gl': location,
            'hl': 'en',
            'num': 20
        }
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    f"{self.serper_base_url}/search",
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        raise Exception(f"Serper API error: {response.status}")
            except Exception as e:
                raise Exception(f"Failed to fetch search data: {str(e)}")
    
    async def search_news_data(self, query: str, location: str = "us") -> Dict:
        """
        Search for news data using Serper API
        """
        headers = {
            'X-API-KEY': self.serper_api_key,
            'Content-Type': 'application/json',
        }
        
        payload = {
            'q': query,
            'gl': location,
            'hl': 'en',
            'num': 15
        }
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    f"{self.serper_base_url}/news",
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        raise Exception(f"Serper News API error: {response.status}")
            except Exception as e:
                raise Exception(f"Failed to fetch news data: {str(e)}")
    
    async def search_images(self, query: str) -> Dict:
        """
        Search for images using Serper API
        """
        headers = {
            'X-API-KEY': self.serper_api_key,
            'Content-Type': 'application/json',
        }
        
        payload = {
            'q': query,
            'num': 10
        }
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    f"{self.serper_base_url}/images",
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        raise Exception(f"Serper Images API error: {response.status}")
            except Exception as e:
                raise Exception(f"Failed to fetch image data: {str(e)}")
    
    async def parse_market_data_with_gemini(self, raw_data: Dict, analysis_type: str) -> Dict:
        """
        Parse and analyze market data using Gemini AI
        """
        prompt = self._generate_analysis_prompt(raw_data, analysis_type)
        
        try:
            response = await asyncio.to_thread(
                self.model.generate_content, prompt
            )
            
            analysis_text = response.text
            
            structure_prompt = f"""
            Please convert the following market analysis into a well-structured JSON format with these sections:
            - market_overview: A brief summary
            - key_insights: Array of important findings
            - market_size: Information about market size and growth
            - competitors: Array of competitor information
            - trends: Array of market trends
            - opportunities: Array of business opportunities
            - challenges: Array of market challenges
            - recommendations: Array of actionable recommendations
            
            Analysis text:
            {analysis_text}
            
            Return only valid JSON without any markdown formatting.
            """
            
            structured_response = await asyncio.to_thread(
                self.model.generate_content, structure_prompt
            )
            
            try:
                json_text = structured_response.text.strip()
                if json_text.startswith('```json'):
                    json_text = json_text[7:-3]
                elif json_text.startswith('```'):
                    json_text = json_text[3:-3]
                
                parsed_json = json.loads(json_text)
                
                expected_fields = ['market_overview', 'key_insights', 'market_size', 'competitors', 'trends', 'opportunities', 'challenges', 'recommendations']
                
                result = {}
                for field in expected_fields:
                    if field in parsed_json:
                        result[field] = parsed_json[field]
                    elif field == 'market_overview' or field == 'market_size':
                        result[field] = "Data not available"
                    else:
                        result[field] = []
                
                return result
                
            except json.JSONDecodeError as e:
                print(f"JSON parsing error: {e}")
                print(f"Attempting to parse: {json_text[:200]}...")
                
                return {
                    "market_overview": analysis_text[:500] if len(analysis_text) > 500 else analysis_text,
                    "key_insights": [analysis_text[500:1000]] if len(analysis_text) > 500 else [analysis_text],
                    "market_size": "Data not available",
                    "competitors": [],
                    "trends": [],
                    "opportunities": [],
                    "challenges": [],
                    "recommendations": [],
                    "raw_analysis": analysis_text
                }
                
        except Exception as e:
            raise Exception(f"Failed to analyze data with Gemini: {str(e)}")
    
    def _generate_analysis_prompt(self, data: Dict, analysis_type: str) -> str:
        """
        Generate appropriate prompt for Gemini based on analysis type
        """
        base_prompt = f"""
        You are an expert market research analyst. Analyze the following search results and provide detailed insights for {analysis_type}.
        
        Search Results:
        {json.dumps(data, indent=2)}
        
        Please provide a comprehensive analysis with exactly these sections:
        1. Market Overview: A concise summary of the current market state (2-3 sentences)
        2. Key Insights: 5-7 specific, actionable insights as bullet points
        3. Market Size: Information about market size, growth rate, and financial data
        4. Competitors: List of main competitors with brief descriptions
        5. Current Market Trends: 4-6 key trends affecting this market
        6. Business Opportunities: 4-6 specific opportunities for growth or entry
        7. Challenges and Risks: 4-6 potential challenges or threats
        8. Strategic Recommendations: 5-7 actionable recommendations
        
        IMPORTANT: Structure your response as valid JSON with these exact field names:
        - market_overview (string)
        - key_insights (array of strings)
        - market_size (string)
        - competitors (array of strings)
        - trends (array of strings)
        - opportunities (array of strings)
        - challenges (array of strings)
        - recommendations (array of strings)
        
        Focus on actionable insights and data-driven conclusions. Be specific and avoid generic advice.
        """
        
        return base_prompt
    
    async def comprehensive_market_research(self, 
                                          market_query: str, 
                                          location: str = "us",
                                          include_news: bool = True,
                                          include_images: bool = False) -> Dict:
        """
        Perform comprehensive market research combining search, news, and AI analysis
        """
        try:
            tasks = []
            
            tasks.append(self.search_market_data(market_query, location))
            
            if include_news:
                news_query = f"{market_query} market trends news industry"
                tasks.append(self.search_news_data(news_query, location))
            
            if include_images:
                image_query = f"{market_query} market analysis charts"
                tasks.append(self.search_images(image_query))
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            search_data = results[0] if not isinstance(results[0], Exception) else {}
            news_data = results[1] if len(results) > 1 and include_news and not isinstance(results[1], Exception) else {}
            image_data = results[2] if len(results) > 2 and include_images and not isinstance(results[2], Exception) else {}
            
            combined_data = {
                "search_results": search_data,
                "news_results": news_data,
                "image_results": image_data if include_images else {}
            }
            
            analysis = await self.parse_market_data_with_gemini(combined_data, market_query)
            
            return {
                "query": market_query,
                "location": location,
                "timestamp": asyncio.get_event_loop().time(),
                "raw_data": combined_data,
                "analysis": analysis,
                "metadata": {
                    "search_results_count": len(search_data.get("organic", [])),
                    "news_results_count": len(news_data.get("news", [])),
                    "image_results_count": len(image_data.get("images", [])) if include_images else 0
                }
            }
            
        except Exception as e:
            raise Exception(f"Comprehensive market research failed: {str(e)}")
    
    async def competitor_analysis(self, company_name: str, industry: str, location: str = "us") -> Dict:
        """
        Perform competitor analysis for a specific company/industry
        """
        queries = [
            f"{company_name} competitors {industry}",
            f"{industry} market leaders companies",
            f"{company_name} vs competitors comparison",
            f"{industry} competitive landscape analysis"
        ]
        
        try:
            competitor_tasks = [self.search_market_data(query, location) for query in queries]
            competitor_results = await asyncio.gather(*competitor_tasks, return_exceptions=True)
            
            combined_competitor_data = {
                "competitor_search": [r for r in competitor_results if not isinstance(r, Exception)],
                "company": company_name,
                "industry": industry
            }
            
            analysis_prompt = f"""
            Perform a detailed competitor analysis for {company_name} in the {industry} industry.
            
            Based on the search results provided, create a comprehensive analysis with the following structure:
            
            1. Market Overview: Current state of the {industry} market and {company_name}'s position
            2. Key Insights: 5-7 critical findings about the competitive landscape
            3. Market Size: Information about market size, growth rate, and {company_name}'s market share
            4. Direct Competitors: List of main competitors with brief descriptions
            5. Market Trends: Current trends affecting the competitive landscape
            6. Business Opportunities: Gaps and opportunities for competitive advantage
            7. Challenges: Key competitive challenges and threats
            8. Strategic Recommendations: Actionable recommendations for competitive positioning
            
            Provide specific, actionable insights based on the data. Focus on competitive intelligence.
            
            Search Data: {json.dumps(combined_competitor_data, indent=2)}
            """
            
            competitor_analysis = await self.parse_market_data_with_gemini(
                combined_competitor_data, 
                f"competitor analysis for {company_name}"
            )
            
            return {
                "query": f"{company_name} competitors in {industry}",
                "location": location,
                "timestamp": asyncio.get_event_loop().time(),
                "raw_data": combined_competitor_data,
                "competitor_analysis": competitor_analysis,
                "metadata": {
                    "search_results_count": sum(len(r.get("organic", [])) for r in competitor_results if not isinstance(r, Exception)),
                    "news_results_count": 0,
                    "image_results_count": 0
                }
            }
            
        except Exception as e:
            raise Exception(f"Competitor analysis failed: {str(e)}")
    
    async def trend_analysis(self, industry: str, time_period: str = "recent", location: str = "us") -> Dict:
        """
        Analyze industry trends and future predictions
        """
        trend_queries = [
            f"{industry} trends 2025 predictions",
            f"{industry} market forecast future",
            f"{industry} emerging technologies innovations",
            f"{industry} consumer behavior changes",
            f"{industry} regulatory changes impact"
        ]
        
        try:
            trend_tasks = [self.search_market_data(query, location) for query in trend_queries]
            news_tasks = [self.search_news_data(query, location) for query in trend_queries[:3]]  # Limit news queries
            
            trend_results = await asyncio.gather(*trend_tasks, return_exceptions=True)
            news_results = await asyncio.gather(*news_tasks, return_exceptions=True)
            
            combined_trend_data = {
                "trend_search": [r for r in trend_results if not isinstance(r, Exception)],
                "trend_news": [r for r in news_results if not isinstance(r, Exception)],
                "industry": industry,
                "time_period": time_period
            }
            
            trend_analysis = await self.parse_market_data_with_gemini(
                combined_trend_data,
                f"trend analysis for {industry} industry"
            )
            
            return {
                "query": f"{industry} trends and predictions",
                "location": location,
                "timestamp": asyncio.get_event_loop().time(),
                "raw_data": combined_trend_data,
                "trend_analysis": trend_analysis,
                "metadata": {
                    "search_results_count": sum(len(r.get("organic", [])) for r in trend_results if not isinstance(r, Exception)),
                    "news_results_count": sum(len(r.get("news", [])) for r in news_results if not isinstance(r, Exception)),
                    "image_results_count": 0
                }
            }
            
        except Exception as e:
            raise Exception(f"Trend analysis failed: {str(e)}")