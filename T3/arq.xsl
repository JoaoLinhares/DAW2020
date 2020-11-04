<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="/">
        <xsl:result-document href="site/index.html">
            <html>
                <head>
                    <title>Arquivos de Arqueossítios</title>
                    <link rel="stylesheet" href="../css/w3.css"/>
                    <link rel="stylesheet" href="../css/site.css"/>
                </head>
                <body style="background-color: teal;">
                    
                    <header class="w3-container w3-pale-yellow">
                        <h1 class="title">Arquivos de Arqueossítios</h1>
                    </header>
                   
                    <h2 class="subtitle" style="margin-top:30px;"><b>Índice de Arqueossítios</b></h2>
                    <ol style="margin-left: 15%; margin-top: 5%; margin-bottom: 5%;">
                        <xsl:apply-templates select="//ARQELEM" mode="indice">
                            <xsl:sort select="IDENTI"/>
                        </xsl:apply-templates>
                    </ol>
                    
                    <footer class="w3-container w3-pale-yellow">
                        <p class="title">Desenvolvimento Aplicações Web 2020</p>
                    </footer>
                </body>
            </html>
        </xsl:result-document>
        <xsl:apply-templates/>
    </xsl:template>
    
    <!-- Template Índice -->
    
    <xsl:template match="ARQELEM" mode="indice">
        <li class="simpletext">
            <a name="arqelemi{position()}"/>
            <a href="conteudo/arqelem{position()}.html">
                <xsl:value-of select="IDENTI"/>
            </a>
        </li>
    </xsl:template>    
    
    <!-- Template Conteúdo -->
    
    <xsl:template match=".">
        <xsl:apply-templates select="//ARQELEM" mode="conteudo">
            <xsl:sort select="IDENTI"/>
        </xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="ARQELEM" mode="conteudo">
        <xsl:result-document href="site/conteudo/arqelem{position()}.html">
            <html>
                <head>
                    <title><xsl:value-of select="IDENTI"/></title>
                    <link rel="stylesheet" href="../../css/w3.css"/>
                    <link rel="stylesheet" href="../../css/site.css"/>
                </head>
                <body style="background-color: teal;">

                    <header class="w3-container w3-pale-yellow" style="margin-bottom:5%;">
                        <h1 class="title">Arquivos de Arqueossítios</h1>
                    </header>
                    
                    <h2 class="subtitle"><b><xsl:value-of select="IDENTI"/></b></h2>
                    
                    <xsl:apply-templates select="DESCRI"/>

                    <xsl:apply-templates select="CRONO"/>
                    
                    <header class="w3-container w3-pale-yellow" style="margin-top:5%; margin-bottom:5%;">
                        <h3 class="title">Dados</h3>
                    </header>
                    
                    <ul style="margin-bottom:5%; margin-right:2%;">
                        <xsl:apply-templates select="LUGAR"/>
                        <xsl:apply-templates select="FREGUE"/>
                        <xsl:apply-templates select="CONCEL"/>
                        <xsl:apply-templates select="LATITU"/>
                        <xsl:apply-templates select="LONGIT"/>
                        <xsl:apply-templates select="ALTITU"/>
                        <xsl:apply-templates select="CODADM"/>
                        <xsl:apply-templates select="AUTOR"/>
                        <xsl:apply-templates select="DATA"/>
                    </ul>
                    
                    <header class="w3-container w3-pale-yellow" style="margin-bottom:5%;">
                        <h3 class="title">Informações</h3>
                    </header>
                    
                    <ul style="margin-bottom:5%; margin-right:2%;">
                        <xsl:apply-templates select="ACESSO"/>
                        <xsl:apply-templates select="QUADRO"/>
                        <xsl:apply-templates select="TRAARQ"/>
                        <xsl:apply-templates select="DESARQ"/>
                        <xsl:apply-templates select="INTERP"/>
                        <xsl:apply-templates select="DEPOSI"/>
                        <xsl:apply-templates select="INTERE"/>
                    </ul>
                    
                    <xsl:if test="BIBLIO">
                        <div>
                            <header class="w3-container w3-pale-yellow" style="margin-bottom:5%;">
                            <h3 class="title">Bibliografia</h3>
                            </header>
                            <ul style="margin-right:2%;">
                                <xsl:for-each select="BIBLIO">
                                    <li class="simpletext">
                                        <xsl:apply-templates/>
                                    </li>
                                </xsl:for-each>
                            </ul>
                        </div>
                    </xsl:if>
                    
                    <div class="w3-row" style="margin-top: 5%; margin-right:10%; margin-left:10%; text-align: center;">
                        <div class="w3-third w3-container">
                            <address class="simpletext">
                                <xsl:choose>
                                    <xsl:when test="position() - 1 = 0">
                                        [<a href="arqelem{count(//ARQELEM)}.html">Anterior</a>]
                                    </xsl:when>
                                    <xsl:otherwise>
                                        [<a href="arqelem{position() - 1}.html">Anterior</a>]
                                    </xsl:otherwise>
                                </xsl:choose>
                            </address>
                        </div>
                        <div class="w3-third w3-container">
                            <address class="simpletext">
                                [<a href="../index.html#arqelemi{position()}">Voltar ao Índice</a>]
                            </address>
                        </div>
                        <div class="w3-third w3-container">
                            <address class="simpletext">
                                <xsl:choose>
                                    <xsl:when test="position() + 1 > count(//ARQELEM)">
                                        [<a href="arqelem1.html">Próximo</a>]
                                    </xsl:when>
                                    <xsl:otherwise>
                                        [<a href="arqelem{position() + 1}.html">Próximo</a>]
                                    </xsl:otherwise>
                                </xsl:choose>
                            </address>
                        </div>
                    </div>
                    
                    <footer class="w3-container w3-pale-yellow" style="margin-top: 30px">
                        <p class="title">Desenvolvimento Aplicações Web 2020</p>
                    </footer>
                </body>
            </html>
        </xsl:result-document>
    </xsl:template> 
    
    <xsl:template match="DESCRI">
        <h3 class="subtitle"><xsl:apply-templates/></h3>
    </xsl:template>
    
    <xsl:template match="CRONO">
        <h4 class="subtitle"><xsl:apply-templates/></h4>
    </xsl:template>
    
    <xsl:template match="LUGAR">
        <p class="simpletext"><b class="boxtext">Lugar:</b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="FREGUE">
        <p class="simpletext"><b class="boxtext">Freguesia:</b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="CONCEL">
        <p class="simpletext"><b class="boxtext">Concelho:</b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="LATITU">
        <p class="simpletext"><b class="boxtext">Latitude:</b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="LONGIT">
        <p class="simpletext"><b class="boxtext">Longitude:</b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="ALTITU">
        <p class="simpletext"><b class="boxtext">Altitude:</b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="CODADM">
        <p class="simpletext"><b class="boxtext">Código de Administrador:</b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="AUTOR">
        <p class="simpletext"><b class="boxtext">Autor:</b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="DATA">
        <p class="simpletext"><b class="boxtext">Data: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="ACESSO">
        <p class="simpletext"><b class="boxtext">Acesso: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="QUADRO">
        <p class="simpletext"><b class="boxtext">Quadro: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="TRAARQ">
        <p class="simpletext"><b class="boxtext">Trablahos Arqueológicos: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="DESARQ">
        <p class="simpletext"><b class="boxtext">Descrição Arqueológica: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="INTERP">
        <p class="simpletext"><b class="boxtext">Interpretação: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="DEPOSI">
        <p class="simpletext"><b class="boxtext">Depósito: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="INTERE">
        <p class="simpletext"><b class="boxtext">Interesse: </b><xsl:apply-templates/></p>
    </xsl:template>
    
    <xsl:template match="text()">
        <xsl:copy/>
    </xsl:template>
    
    <xsl:template match="LIGA">
        <b>
            <xsl:value-of select="."/>
        </b>
    </xsl:template>
</xsl:stylesheet>

