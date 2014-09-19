<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:gmd="http://www.isotc211.org/2005/gmd"
  xmlns:gco="http://www.isotc211.org/2005/gco"
  xmlns:monitoring="http://inspire.jrc.ec.europa.eu/monitoringreporting/monitoring"
  exclude-result-prefixes="xs"
  version="2.0">
  
  <xsl:variable name="reportingYear" select="/monitoring:Monitoring/documentYear/year"/>
  <xsl:variable name="reportingTerritory" select="/monitoring:Monitoring/memberState"/>

  <!-- TODO: format date properly -->
  <xsl:variable name="reportingDate" select="concat(
    /monitoring:Monitoring/MonitoringMD/monitoringDate/year, 
    '-0', /monitoring:Monitoring/MonitoringMD/monitoringDate/month, 
    '-', /monitoring:Monitoring/MonitoringMD/monitoringDate/day, 'T12:00:00Z')"/>

  <xsl:template match="/">
    <add>
      <xsl:apply-templates select="//Indicators/*"/>
    </add>
  </xsl:template>
  
  <xsl:template match="Indicators/*">
    <xsl:variable name="indicatorType" select="local-name()"/>
    <xsl:for-each select="descendant::*[count(*) = 0]">
      <xsl:variable name="indicatorIdentifier" select="local-name()"/>
      <doc>
        <field name="id"><xsl:value-of
                select="concat('indicator', $indicatorIdentifier,
                $reportingYear, $reportingTerritory)"/></field>
        <field name="documentType">indicator</field>
        <field name="indicatorType"><xsl:value-of select="$indicatorType"/></field>
        <field name="indicatorName"><xsl:value-of select="$indicatorIdentifier"/></field>
        <field name="indicatorValue"><xsl:value-of select="text()"/></field>
        <field name="territory"><xsl:value-of select="$reportingTerritory"/></field>
        <field name="reportingDate"><xsl:value-of select="$reportingDate"/></field>
      </doc>
    </xsl:for-each>
    
  </xsl:template>
</xsl:stylesheet>