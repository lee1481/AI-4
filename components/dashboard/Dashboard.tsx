import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import Card from '../ui/Card';
import { getContracts, getBrands } from '../../services/dataService';
import { Page } from '../../App';

const COLORS = ['#0A2E5B', '#2c5282', '#FF7A00', '#ed8936', '#f6ad55'];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value.toLocaleString()} 원`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(점유율 ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const calculateDaysOverdue = (constructionDate: string): number => {
    const today = new Date();
    const constDate = new Date(constructionDate);
    today.setHours(0, 0, 0, 0);
    constDate.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - constDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

const Dashboard: React.FC<{setCurrentPage: (page: Page) => void}> = ({setCurrentPage}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const allContracts = useMemo(() => getContracts(), []);

  const { brandOptions, yearOptions } = useMemo(() => {
    const endYear = 2035;
    const startYear = 2025;
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => (startYear + i).toString());

    return {
      brandOptions: getBrands().map(b => b.name),
      yearOptions: years,
    };
  }, []);

  const monthOptions = [
    { value: 'all', label: '전체 (연간)' },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: (i + 1).toString(),
      label: `${i + 1}월`,
    })),
  ];
  
  const filteredContracts = useMemo(() => {
    return allContracts.filter(contract => {
      const contractDate = new Date(contract.contractDate);
      const yearMatch = selectedYear === 'all' || contractDate.getFullYear().toString() === selectedYear;
      const monthMatch = selectedMonth === 'all' || (contractDate.getMonth() + 1).toString() === selectedMonth;
      const brandMatch = selectedBrand === 'all' || contract.brandName === selectedBrand;
      return yearMatch && monthMatch && brandMatch;
    });
  }, [selectedBrand, selectedYear, selectedMonth, allContracts]);

  const { summary, monthlyChartData, brandDistributionData, receivables } = useMemo(() => {
    const totalSales = filteredContracts.reduce((acc, c) => acc + c.salesAmount, 0);
    const totalPurchases = filteredContracts.reduce((acc, c) => acc + c.totalPurchaseAmount, 0);
    const totalProfit = totalSales - totalPurchases;

    const monthlyData: { [key: string]: { sales: number; purchases: number; profit: number } } = {};
    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

    filteredContracts.forEach(c => {
        const monthIndex = new Date(c.contractDate).getMonth();
        const monthKey = monthNames[monthIndex];
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { sales: 0, purchases: 0, profit: 0 };
        }
        monthlyData[monthKey].sales += c.salesAmount;
        monthlyData[monthKey].purchases += c.totalPurchaseAmount;
        monthlyData[monthKey].profit += (c.salesAmount - c.totalPurchaseAmount);
    });
    
    const finalMonthlyChartData = monthNames.map(name => ({
        name,
        sales: monthlyData[name]?.sales || 0,
        purchases: monthlyData[name]?.purchases || 0,
        profit: monthlyData[name]?.profit || 0,
    }));

    const brandData: { [key: string]: number } = {};
    filteredContracts.forEach(c => {
        if (!brandData[c.brandName]) {
            brandData[c.brandName] = 0;
        }
        brandData[c.brandName] += c.salesAmount;
    });
    const finalBrandDistributionData = Object.entries(brandData).map(([name, value]) => ({ name, value }));
    
    // A/R calculations on ALL contracts, not just filtered ones
    let totalOutstanding = 0;
    const overdueContracts = allContracts.map(c => {
        const totalPaid = c.payments.reduce((sum, p) => sum + p.amount, 0);
        const balance = c.salesAmount - totalPaid;
        return { ...c, balance };
    })
    .filter(c => c.balance > 0 && !c.collectionDate)
    .map(c => {
        totalOutstanding += c.balance;
        return {...c, daysOverdue: calculateDaysOverdue(c.constructionDate)};
    })
    .sort((a, b) => b.daysOverdue - a.daysOverdue);

    return {
      summary: { totalSales, totalProfit },
      monthlyChartData: finalMonthlyChartData,
      brandDistributionData: finalBrandDistributionData,
      receivables: {
          totalOutstanding,
          topOverdue: overdueContracts.slice(0, 5),
      }
    };
  }, [filteredContracts, allContracts]);

  const [activeIndex, setActiveIndex] = React.useState(0);
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-1">년도</label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 border rounded-md shadow-sm focus:ring-navy focus:border-navy"
            >
              {yearOptions.map(year => <option key={year} value={year}>{year}년</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-1">월</label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-2 border rounded-md shadow-sm focus:ring-navy focus:border-navy"
            >
              {monthOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="brand-select" className="block text-sm font-medium text-gray-700 mb-1">브랜드</label>
            <select
              id="brand-select"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full p-2 border rounded-md shadow-sm focus:ring-navy focus:border-navy"
            >
              <option value="all">전체 브랜드</option>
              {brandOptions.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <h4 className="text-gray-text font-semibold">총 매출액 (필터 적용)</h4>
          <p className="text-3xl font-bold text-navy mt-2">{summary.totalSales.toLocaleString()} 원</p>
        </Card>
        <Card>
          <h4 className="text-gray-text font-semibold">총 순손익 (필터 적용)</h4>
          <p className="text-3xl font-bold text-navy mt-2">{summary.totalProfit.toLocaleString()} 원</p>
        </Card>
        <Card>
          <h4 className="text-gray-text font-semibold">수익률 (필터 적용)</h4>
          <p className="text-3xl font-bold text-navy mt-2">
            {summary.totalSales > 0 ? ((summary.totalProfit / summary.totalSales) * 100).toFixed(1) : '0.0'}%
          </p>
        </Card>
         <Card className="bg-orange-50">
          <h4 className="text-orange-900 font-semibold">총 미수금액 (전체)</h4>
          <p className="text-3xl font-bold text-orange-accent mt-2">{receivables.totalOutstanding.toLocaleString()} 원</p>
        </Card>
      </div>
      
      {filteredContracts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card title={`${selectedYear}년 실적 추이`}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()} 원`} />
                  <Legend />
                  <Bar dataKey="sales" fill="#0A2E5B" name="매출액" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="purchases" fill="#6B7280" name="매입액" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" fill="#FF7A00" name="순손익" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <Card title="브랜드별 매출 비중">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={brandDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#0A2E5B"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {brandDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-text">선택한 조건에 해당하는 데이터가 없습니다.</h3>
                <p className="text-sm text-gray-500 mt-2">다른 필터 옵션을 선택해주세요.</p>
            </div>
        </Card>
      )}

      <Card title="미수금 현황 (상위 5건)" headerActions={
          <button onClick={() => setCurrentPage(Page.Receivables)} className="px-3 py-1 text-sm font-medium text-white bg-navy rounded-md hover:bg-opacity-90">
              전체 보기
          </button>
      }>
          {receivables.topOverdue.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                  {receivables.topOverdue.map(c => (
                      <li key={c.id} className="py-3 flex justify-between items-center">
                          <div>
                              <p className="text-md font-semibold text-navy">{c.brandName} <span className="text-gray-500 font-normal">({c.branchName})</span></p>
                              <p className="text-sm text-gray-text">담당자: {c.salesperson}</p>
                          </div>
                          <div className="text-right">
                              <p className="text-lg font-bold text-orange-accent">{c.balance.toLocaleString()} 원</p>
                              <p className="text-sm text-red-500">시공일로부터 {c.daysOverdue}일 경과</p>
                          </div>
                      </li>
                  ))}
              </ul>
          ) : (
              <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-gray-text">미수금이 없습니다.</h3>
                  <p className="text-sm text-gray-500 mt-2">모든 계약의 잔금이 정산되었습니다.</p>
              </div>
          )}
      </Card>
    </div>
  );
};

export default Dashboard;